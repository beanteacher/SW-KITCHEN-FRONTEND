"use client";

import { usePathname } from "next/navigation";
import { useMe } from "@/features/auth";
import AdminMenu from "./AdminMenu";

// 지금 주소로 고른 메뉴를 표시하고, 역할에 맞는 메뉴만 보여 준다. 주소를 읽으므로 Suspense 안에 둔다
export default function AdminMenuWithPath() {
  const pathname = usePathname();
  const { data: me } = useMe();
  return <AdminMenu activePath={pathname} role={me?.role} />;
}
