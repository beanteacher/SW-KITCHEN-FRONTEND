"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

// 고른 대분류를 주소(?big=)에 남긴다. 새로 고쳐도 같은 중분류가 보인다
export function useCategorySearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const bigId = Number(searchParams.get("big")) || null;

  const setBigId = (id: number) => {
    router.replace(`${pathname}?big=${id}`, { scroll: false });
  };

  return { bigId, setBigId };
}
