"use client";

import type { ReactNode } from "react";
import { AlertDialog, ErrorView, StatusView } from "@/shared/ui";
import { AdminPageHeader, AdminTable } from "@/shared/ui/admin";
import type { ProductsTarget } from "../model/client/categoryAdminTypes";
import { useCategoryAdminActions } from "../model/useCategoryAdminActions";
import CategoryPanel from "./CategoryPanel";

function Header() {
  return (
    <>
      <AdminPageHeader title="분류 관리" />
      <p className="mb-4 leading-5 text-admin-sub">
        순서·이름은 저장하면 고객 화면에 바로 반영됩니다. 약어는 상품 코드 앞자리(예: 냉장·냉동 RF +
        업소용 냉장고 UR → <span className="font-mono text-xs">RFUR-00123-01</span>)라서 제품이
        연결된 뒤에는 바꿀 수 없습니다.
      </p>
    </>
  );
}

interface Props {
  // 분류의 제품을 보여 줄 옆 패널. 제품 기능이 그리므로 밖(위젯)에서 넣는다
  renderProductsPanel?: (target: ProductsTarget | null, onClose: () => void) => ReactNode;
}

// 왼쪽 대분류 표, 오른쪽 고른 대분류의 중분류 표
export default function CategoryManager({ renderProductsPanel }: Props) {
  const {
    categories,
    big,
    isLoading,
    isError,
    alert,
    productsTarget,
    panelHandlers,
    handleRetry,
    handleSelectBig,
    handleMove,
    handleCloseAlert,
    handleCloseProducts,
  } = useCategoryAdminActions();
  // 패널이 없으면 수량은 숫자로만, 막힘 창에는 [제품 보기]를 두지 않는다
  const handlers = renderProductsPanel
    ? panelHandlers
    : { ...panelHandlers, onShowProducts: undefined };

  if (isLoading) {
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
      <ErrorView message="분류를 불러오지 못했습니다." onRetry={handleRetry} variant="admin" />
    );
  }

  return (
    <>
      <Header />
      {/* 본문이 940px 보다 좁으면 두 표를 위아래로 놓는다 */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(460px,1fr))] items-start gap-x-5 gap-y-4">
        <CategoryPanel
          parent={null}
          categories={categories}
          selectedId={big?.id}
          onSelect={handleSelectBig}
          onMove={handleMove(categories, null)}
          {...handlers}
        />
        {big ? (
          // 대분류를 바꾸면 추가 줄에 치던 값은 비운다
          <CategoryPanel
            key={big.id}
            parent={big}
            categories={big.children ?? []}
            onMove={handleMove(big.children ?? [], big.id)}
            {...handlers}
          />
        ) : (
          <section aria-label="중분류">
            <h2 className="mb-2 text-sm leading-[normal] font-bold">중분류</h2>
            <AdminTable className="py-[60px] text-center text-admin-sub">
              대분류를 먼저 추가하세요.
            </AdminTable>
          </section>
        )}
      </div>
      <AlertDialog
        open={alert !== null}
        kind={alert?.kind ?? "success"}
        title={alert?.title ?? ""}
        onClose={handleCloseAlert}
        onConfirm={alert?.onConfirm}
        extraAction={renderProductsPanel ? alert?.extraAction : undefined}
      >
        {alert?.message}
      </AlertDialog>
      {renderProductsPanel?.(productsTarget, handleCloseProducts)}
    </>
  );
}
