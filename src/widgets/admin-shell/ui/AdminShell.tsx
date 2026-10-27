"use client";

import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { useAdminAuthGuard } from "../model/useAdminAuthGuard";
import AccountInfo from "./AccountInfo";
import AdminContent from "./AdminContent";
import AdminMenu from "./AdminMenu";
import AdminMenuWithPath from "./AdminMenuWithPath";

interface Props {
  children: ReactNode;
}

// 관리 화면 틀: 검정 위 띠 56px + 왼쪽 메뉴 200px + 회색 본문, 1024px 보다 좁으면 가로로 스크롤
export default function AdminShell({ children }: Props) {
  useAdminAuthGuard();

  return (
    <div className="flex min-h-screen min-w-[1024px] flex-col text-[13px]">
      <header className="flex h-14 shrink-0 items-center justify-between bg-ink px-5 text-white">
        <Link href="/admin" className="text-[17px] font-bold">
          성원종합주방
          <small className="ml-2 text-[13px] font-normal text-white/60">관리</small>
        </Link>
        <AccountInfo />
      </header>
      <div className="flex flex-1">
        <aside className="w-[200px] shrink-0 border-r border-admin-line bg-white py-4">
          <Suspense fallback={<AdminMenu />}>
            <AdminMenuWithPath />
          </Suspense>
        </aside>
        <main className="min-w-0 flex-1 bg-admin-bg px-6 pt-5 pb-[60px]">
          <AdminContent>{children}</AdminContent>
        </main>
      </div>
    </div>
  );
}
