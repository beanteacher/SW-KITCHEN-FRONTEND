"use client";

import { useCategoryTree } from "@/entities/category";
import { type ProductDto, useAdminProducts } from "@/entities/product";
import { useProductListSearchParams } from "./useProductListSearchParams";

const PAGE_SIZE = 20;

// 제품 관리 목록: 주소의 조건으로 목록을 읽고, 찾기 줄·페이지 번호의 동작을 모은다
export function useProductListActions() {
  const { filters, hrefWith, applyFilters, resetFilters } = useProductListSearchParams();
  const { data: tree = [] } = useCategoryTree();

  // categoryId 가 대분류면 그 대분류, 중분류면 그 부모를 고른 것으로 본다
  const big = tree.find(
    (item) =>
      item.id === filters.categoryId ||
      item.children?.some((child) => child.id === filters.categoryId),
  );
  const midId = big && big.id !== filters.categoryId ? filters.categoryId : null;

  const params: ProductDto.AdminSearchParams = {
    keyword: filters.keyword || undefined,
    categoryId: filters.categoryId ?? undefined,
    salesType: filters.salesType ?? undefined,
    page: filters.page,
    size: PAGE_SIZE,
  };
  const { data, isPending, isError, refetch } = useAdminProducts(params);

  const isFiltered = Boolean(filters.keyword || filters.categoryId || filters.salesType);

  return {
    filters,
    tree,
    bigId: big?.id ?? null,
    midId,
    mids: big?.children ?? [],
    products: data?.content ?? [],
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    isPending,
    isError,
    isFiltered,
    pageHref: (page: number) => hrefWith({ page }),
    handleSearch: (keyword: string) => applyFilters({ keyword: keyword.trim() }),
    // 대분류를 바꾸면 중분류는 "전체"로 돌아간다. 0 은 "전체"
    handleSelectBig: (id: number) => applyFilters({ categoryId: id || null }),
    handleSelectMid: (id: number) => applyFilters({ categoryId: id || big?.id || null }),
    handleSelectSalesType: (salesType: ProductDto.SalesType | null) => applyFilters({ salesType }),
    handleReset: resetFilters,
    handleRetry: () => refetch(),
  };
}
