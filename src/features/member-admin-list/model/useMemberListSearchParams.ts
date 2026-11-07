"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  type MemberListFilters,
  parseMemberListFilters,
  toMemberListQuery,
} from "../lib/memberListFilters";

// 검색어·페이지를 주소에 남긴다
export function useMemberListSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const filters = parseMemberListFilters(useSearchParams());

  const hrefWith = (next: Partial<MemberListFilters>) => {
    const query = toMemberListQuery({ ...filters, ...next });
    return query ? `${pathname}?${query}` : pathname;
  };

  // 검색하면 1페이지부터 다시 본다
  const search = (keyword: string) => {
    router.push(hrefWith({ keyword: keyword.trim(), page: 1 }), { scroll: false });
  };

  const reset = () => router.push(pathname, { scroll: false });

  return { filters, hrefWith, search, reset };
}
