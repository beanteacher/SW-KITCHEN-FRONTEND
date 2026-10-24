"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { AdminCategory } from "@/entities/category";
import { ApiError, toApiError } from "@/shared/api";
import { toast } from "@/shared/lib";
import { AlertDialog, ErrorView, PageTitle, StatusView } from "@/shared/ui";
import { getDeleteBlockReason, moveCategory } from "../lib/category-rules";
import {
  useAdminCategories,
  useChangeCategoryOrder,
  useDeleteCategory,
} from "../model/use-category-admin";
import { CategoryPanel } from "./category-panel";
import { TableFrame } from "./table-cell";

interface AlertState {
  kind: "warning" | "success" | "confirm";
  title: string;
  message: string;
  onConfirm?: () => void;
}

function Header() {
  return (
    <>
      <div className="mb-3 border-b border-admin-line pb-3">
        <PageTitle title="분류 관리" variant="admin" />
      </div>
      <p className="mb-4 leading-5 text-gray-600">
        순서·이름은 저장하면 고객 화면에 바로 반영됩니다. 약어는 상품 코드 앞자리(예: 냉장·냉동 RF +
        업소용 냉장고 UR → <span className="font-mono text-xs">RFUR-00123-01</span>)라서 제품이
        연결된 뒤에는 바꿀 수 없습니다.
      </p>
    </>
  );
}

// 왼쪽 대분류 표, 오른쪽 고른 대분류의 중분류 표. 고른 대분류는 주소(?big=)에 남긴다
export function CategoryManager() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: categories, isPending, isError, refetch } = useAdminCategories();
  const { mutate: changeOrder, isPending: isMoving } = useChangeCategoryOrder();
  const { mutate: remove } = useDeleteCategory();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [alert, setAlert] = useState<AlertState | null>(null);

  if (isPending) {
    return (
      <>
        <Header />
        <StatusView message="불러오는 중…" />
      </>
    );
  }

  // 불러오지 못하면 본문 전체를 대신한다
  if (isError) {
    return (
      <ErrorView message="분류를 불러오지 못했습니다." onRetry={() => refetch()} variant="admin" />
    );
  }

  // 주소의 대분류가 없거나 지워졌으면 첫 대분류를 고른다. 첫 대분류를 추가하면 그게 골라진다
  const bigParam = Number(searchParams.get("big"));
  const big = categories.find((category) => category.id === bigParam) ?? categories[0] ?? null;

  const selectBig = (id: number) => {
    if (editingId !== null) return;
    router.replace(`${pathname}?big=${id}`, { scroll: false });
  };

  const showDone = (title: string, message: string) =>
    setAlert({ kind: "success", title, message });

  // 누를 때마다 형제 전체 순서를 바로 저장한다
  const move =
    (siblings: AdminCategory[], parentId: number | null) => (id: number, direction: -1 | 1) => {
      const categoryIds = moveCategory(siblings, id, direction);
      if (!categoryIds) return;
      changeOrder(
        { parentId, categoryIds },
        { onError: (error) => toast(toApiError(error).message, "error") },
      );
    };

  // 지울 수 없는 이유를 먼저 알려 주고, 지울 수 있으면 한 번 더 묻는다
  const askDelete = (category: AdminCategory) => {
    const blockReason = getDeleteBlockReason(category);
    if (blockReason) {
      setAlert({ kind: "warning", title: "삭제 불가", message: blockReason });
      return;
    }
    setAlert({
      kind: "confirm",
      title: "분류 삭제",
      message: `"${category.name}" 분류를 삭제할까요?`,
      onConfirm: () => {
        setAlert(null);
        remove(category.id, {
          onSuccess: () => showDone("삭제 완료", `"${category.name}" 분류가 삭제되었습니다.`),
          onError: (error) => {
            // 화면을 연 뒤 그 사이 제품이나 중분류가 생겼을 때
            if (error instanceof ApiError && error.code === "CATEGORY_IN_USE") {
              setAlert({ kind: "warning", title: "삭제 불가", message: error.message });
              return;
            }
            toast(toApiError(error).message, "error");
          },
        });
      },
    });
  };

  const sharedProps = {
    editingId,
    isMoving,
    onEdit: setEditingId,
    onDelete: askDelete,
    onDone: showDone,
  };

  return (
    <>
      <Header />
      {/* 본문이 940px 보다 좁으면 두 표를 위아래로 놓는다 */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(460px,1fr))] items-start gap-x-5 gap-y-4">
        <CategoryPanel
          parent={null}
          categories={categories}
          selectedId={big?.id}
          onSelect={selectBig}
          onMove={move(categories, null)}
          {...sharedProps}
        />
        {big ? (
          // 대분류를 바꾸면 추가 줄에 치던 값은 비운다
          <CategoryPanel
            key={big.id}
            parent={big}
            categories={big.children}
            onMove={move(big.children, big.id)}
            {...sharedProps}
          />
        ) : (
          <section aria-label="중분류">
            <h2 className="mb-2 text-sm font-bold">중분류</h2>
            <TableFrame className="py-[60px] text-center text-gray-500">
              대분류를 먼저 추가하세요.
            </TableFrame>
          </section>
        )}
      </div>
      <AlertDialog
        open={alert !== null}
        kind={alert?.kind ?? "success"}
        title={alert?.title ?? ""}
        onClose={() => setAlert(null)}
        onConfirm={alert?.onConfirm}
      >
        {alert?.message}
      </AlertDialog>
    </>
  );
}
