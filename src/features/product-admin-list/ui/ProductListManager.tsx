"use client";

import Link from "next/link";
import { formatNumber } from "@/shared/lib";
import { AdminButton, adminButtonClass } from "@/shared/ui/admin";
import { useProductListActions } from "../model/useProductListActions";
import ProductListPanel, { TableMessage } from "./ProductListPanel";
import ProductSearchBox from "./ProductSearchBox";

// 찾기 줄 + 목록. 조건·페이지는 주소에 남는다
export default function ProductListManager() {
  const {
    filters,
    tree,
    bigId,
    midId,
    mids,
    params,
    isFiltered,
    pageHref,
    handleSearch,
    handleSelectBig,
    handleSelectMid,
    handleSelectSalesType,
    handleReset,
  } = useProductListActions();

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
      <ProductListPanel
        params={params}
        pageTarget={{ getHref: pageHref }}
        renderCount={(total) => (
          <>
            검색 결과 <b className="text-admin-error">{formatNumber(total)}</b>건
          </>
        )}
        renderEmpty={() =>
          isFiltered ? (
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
          )
        }
      />
    </>
  );
}
