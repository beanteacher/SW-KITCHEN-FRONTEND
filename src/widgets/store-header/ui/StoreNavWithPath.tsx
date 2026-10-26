"use client";

import { usePathname } from "next/navigation";
import StoreNav from "./StoreNav";

// 지금 주소로 고른 메뉴를 표시한다. 주소를 읽으므로 Suspense 안에 둔다
export default function StoreNavWithPath() {
  const pathname = usePathname();
  return <StoreNav activePath={pathname} />;
}
