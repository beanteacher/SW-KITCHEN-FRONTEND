"use client";

import type { ReactNode } from "react";
import type { ProductDto } from "@/entities/product";
import { AlertDialog, Pagination } from "@/shared/ui";
import { AdminButton, AdminTable } from "@/shared/ui/admin";
import { useProductListBody } from "../model/useProductListBody";
import ProductListTable from "./ProductListTable";

type PageTarget = { getHref: (page: number) => string } | { onPageChange: (page: number) => void };

interface Props {
  params: ProductDto.AdminSearchParams;
  // 표 위 왼쪽 글자 (예: "검색 결과 12건")
  renderCount: (totalElements: number) => ReactNode;
  // 제품이 없을 때 표 자리의 안내
  renderEmpty: () => ReactNode;
  // 제품 관리 화면은 주소로 페이지를 넘기고, 옆 패널은 그 안에서만 넘긴다
  pageTarget: PageTarget;
  // 옆 패널은 목록 확인 + 선택 삭제만 한다. [관리] 칸과 제품명 링크를 뺀다
  readOnly?: boolean;
}

// 표 자리에 띄우는 안내 (불러오는 중·없음·오류)
export function TableMessage({ message, action }: { message: ReactNode; action?: ReactNode }) {
  return (
    <AdminTable role="status" className="flex flex-col items-center gap-4 py-20 text-admin-sub">
      <p className="text-center leading-5">{message}</p>
      {action}
    </AdminTable>
  );
}

// 관리 목록 한 페이지: 표 위 줄([선택 삭제]) + 표 + 페이지 번호 + 알림 창
export default function ProductListPanel({
  params,
  renderCount,
  renderEmpty,
  pageTarget,
  readOnly = false,
}: Props) {
  const {
    products,
    totalElements,
    totalPages,
    isPending,
    isError,
    picked,
    allPicked,
    isDeleting,
    alert,
    handleRetry,
    handleTogglePick,
    handleTogglePickAll,
    handleDelete,
    handleCloseAlert,
  } = useProductListBody(params);

  const renderList = () => {
    if (isError) {
      return (
        <TableMessage
          message="목록을 불러오지 못했습니다."
          action={
            <AdminButton variant="outline" onClick={handleRetry}>
              다시 시도
            </AdminButton>
          }
        />
      );
    }
    if (isPending) return <TableMessage message="불러오는 중…" />;
    if (products.length === 0) return renderEmpty();
    return (
      <>
        <div className="mb-2 flex items-end justify-between">
          <p>{renderCount(totalElements)}</p>
          <AdminButton
            variant="danger"
            size="compact"
            disabled={picked.size === 0 || isDeleting}
            onClick={handleDelete}
          >
            선택 삭제{picked.size > 0 && ` (${picked.size})`}
          </AdminButton>
        </div>
        <ProductListTable
          products={products}
          picked={picked}
          allPicked={allPicked}
          readOnly={readOnly}
          onTogglePick={handleTogglePick}
          onTogglePickAll={handleTogglePickAll}
        />
        <div className="mt-5">
          <Pagination page={params.page} totalPages={totalPages} size="sm" {...pageTarget} />
        </div>
      </>
    );
  };

  return (
    <>
      {renderList()}
      <AlertDialog
        open={alert !== null}
        kind={alert?.kind ?? "success"}
        title={alert?.title ?? ""}
        onClose={handleCloseAlert}
        onConfirm={alert?.onConfirm}
      >
        {alert?.message}
      </AlertDialog>
    </>
  );
}
