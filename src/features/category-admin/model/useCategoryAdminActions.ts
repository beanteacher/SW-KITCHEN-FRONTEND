"use client";

import { useState } from "react";
import { useAdminCategoryTree, type CategoryDto } from "@/entities/category";
import { ApiError, toApiError } from "@/shared/api";
import { toast } from "@/shared/lib";
import { getDeleteBlockReason, moveCategory } from "../lib/categoryRules";
import type {
  AlertState,
  CategoryAdminPageReturn,
  ProductsTarget,
} from "./client/categoryAdminTypes";
import { useChangeCategoryOrder, useDeleteCategory } from "./useCategoryAdminQueries";
import { useCategorySearchParams } from "./useCategorySearchParams";

// 분류 관리 화면의 상태와 처리 함수를 모두 여기서 만든다. 화면은 그리기만 한다
export function useCategoryAdminActions(): CategoryAdminPageReturn {
  const { bigId, setBigId } = useCategorySearchParams();
  const { data, isPending, isError, refetch } = useAdminCategoryTree();
  const { mutate: changeOrder, isPending: isMoving } = useChangeCategoryOrder();
  const { mutate: remove } = useDeleteCategory();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [productsTarget, setProductsTarget] = useState<ProductsTarget | null>(null);

  const categories = data ?? [];
  // 주소의 대분류가 없거나 지워졌으면 첫 대분류를 고른다. 첫 대분류를 추가하면 그게 골라진다
  const big = categories.find((category) => category.id === bigId) ?? categories[0] ?? null;

  const handleSelectBig = (id: number) => {
    if (editingId !== null) return;
    setBigId(id);
  };

  const showDone = (title: string, message: string) =>
    setAlert({ kind: "success", title, message });

  // 누를 때마다 형제 전체 순서를 바로 저장한다
  const handleMove =
    (siblings: CategoryDto.AdminTree[], parentId: number | null) =>
    (id: number, direction: -1 | 1) => {
      const categoryIds = moveCategory(siblings, id, direction);
      if (!categoryIds) return;
      changeOrder(
        { parentId, categoryIds },
        { onError: (error) => toast(toApiError(error).message, "error") },
      );
    };

  // 대분류면 아래 모든 중분류 제품, 중분류면 그 중분류 제품을 옆 패널에 연다
  const handleShowProducts = (category: CategoryDto.AdminTree) => {
    const parent = categories.find((item) =>
      item.children?.some((child) => child.id === category.id),
    );
    setAlert(null);
    setProductsTarget({ id: category.id, name: category.name ?? "", parentName: parent?.name });
  };

  // 지울 수 없는 이유를 먼저 알려 주고, 지울 수 있으면 한 번 더 묻는다
  // 제품 때문에 막혔으면 [제품 보기]로 옆 패널에서 바로 지울 수 있게 한다
  const handleDelete = (category: CategoryDto.AdminTree) => {
    const blockReason = getDeleteBlockReason(category);
    if (blockReason) {
      const blockedByProducts =
        (category.children?.length ?? 0) === 0 && (category.productCount ?? 0) > 0;
      setAlert({
        kind: "warning",
        title: "삭제 불가",
        message: blockReason,
        extraAction: blockedByProducts
          ? { label: "제품 보기", onClick: () => handleShowProducts(category) }
          : undefined,
      });
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

  return {
    categories,
    big,
    isLoading: isPending,
    isError,
    alert,
    productsTarget,
    panelHandlers: {
      editingId,
      isMoving,
      onEdit: setEditingId,
      onDelete: handleDelete,
      onShowProducts: handleShowProducts,
      onDone: showDone,
    },
    handleRetry: () => void refetch(),
    handleSelectBig,
    handleMove,
    handleCloseAlert: () => setAlert(null),
    handleCloseProducts: () => setProductsTarget(null),
  };
}
