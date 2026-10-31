"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type ProductListFilters,
  parseProductListFilters,
  toProductListQuery,
} from "../lib/productListFilters";

// 검색어·분류·판매 구분·페이지를 주소에 남긴다. 수정하고 돌아와도 같은 목록이 보인다
export function useProductListSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const filters = parseProductListFilters(useSearchParams());

  const hrefWith = (next: Partial<ProductListFilters>) => {
    const query = toProductListQuery({ ...filters, ...next });
    return query ? `${pathname}?${query}` : pathname;
  };

  // 조건을 바꾸면 1페이지부터 다시 본다
  const applyFilters = (next: Partial<Omit<ProductListFilters, "page">>) => {
    router.push(hrefWith({ ...next, page: 1 }), { scroll: false });
  };

  const resetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  return { filters, hrefWith, applyFilters, resetFilters };
}
