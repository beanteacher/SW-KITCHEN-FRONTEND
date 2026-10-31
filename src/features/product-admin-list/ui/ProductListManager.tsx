"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { formatNumber } from "@/shared/lib";
import { Pagination } from "@/shared/ui";
import { AdminButton, AdminTable, adminButtonClass } from "@/shared/ui/admin";
import { useProductListActions } from "../model/useProductListActions";
import ProductListTable from "./ProductListTable";
import ProductSearchBox from "./ProductSearchBox";

// 표 자리에 띄우는 안내 (불러오는 중·없음·오류)
function TableMessage({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <AdminTable role="status" className="flex flex-col items-center gap-4 py-20 text-admin-sub">
      <p>{message}</p>
      {action}
    </AdminTable>
  );
}

// 찾기 줄 + 검색 결과 N건 + 표 + 페이지 번호
export default function ProductListManager() {
  const {
    filters,
    tree,
    bigId,
    midId,
    mids,
    products,
    totalElements,
    totalPages,
    isPending,
    isError,
    isFiltered,
    pageHref,
    handleSearch,
    handleSelectBig,
    handleSelectMid,
    handleSelectSalesType,
    handleReset,
    handleRetry,
  } = useProductListActions();

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
    if (products.length === 0) {
      return isFiltered ? (
        <TableMessage
          message="조건에 맞는 제품이 없습니다."
          action={
            <AdminButton variant="outline" onClick={handleReset}>
              초기화
            </AdminButton>
          }
        />
      ) : (
        <TableMessage
          message="등록한 제품이 없습니다."
          action={
            <Link href="/admin/product/new" className={adminButtonClass()}>
              + 제품 등록
            </Link>
          }
        />
      );
    }
    return (
      <>
        <p className="mb-2">
          검색 결과 <b className="text-admin-error">{formatNumber(totalElements)}</b>건
        </p>
        <ProductListTable products={products} />
        <div className="mt-5">
          <Pagination page={filters.page} totalPages={totalPages} getHref={pageHref} size="sm" />
        </div>
      </>
    );
  };

  return (
    <>
      <ProductSearchBox
        filters={filters}
        tree={tree}
        bigId={bigId}
        midId={midId}
        mids={mids}
        onSearch={handleSearch}
        onSelectBig={handleSelectBig}
        onSelectMid={handleSelectMid}
        onSelectSalesType={handleSelectSalesType}
        onReset={handleReset}
      />
      {renderList()}
    </>
  );
}
