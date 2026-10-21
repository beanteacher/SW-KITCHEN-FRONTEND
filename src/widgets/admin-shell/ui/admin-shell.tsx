"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { ROLE_LABEL, useLogout, useMe } from "@/features/auth";
import { ApiError, setAuthFailureHandler } from "@/shared/api";
import { toast } from "@/shared/lib";
import { Button, StatusView } from "@/shared/ui";
import { AdminMenu, AdminMenuWithPath } from "./admin-sidebar";

// 로그인이 풀리면 지금 주소를 붙여 로그인 화면으로 보낸다
function useAdminAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    setAuthFailureHandler((status) => {
      if (status === 401) {
        const here = `${window.location.pathname}${window.location.search}`;
        router.replace(`/login?redirect=${encodeURIComponent(here)}`);
        return;
      }
      toast("이 작업을 할 권한이 없습니다.", "error");
    });
    return () => setAuthFailureHandler(null);
  }, [router]);
}

function AdminContent({ children }: { children: ReactNode }) {
  const { data: me, error, isPending, refetch } = useMe();

  // 화면에서 막는 건 안내용이고, 실제로 막는 건 API 서버다
  if (isPending) return <StatusView message="불러오는 중…" />;

  if (error) {
    const unauthorized = error instanceof ApiError && error.status === 401;
    if (unauthorized) return <StatusView message="로그인 화면으로 이동합니다…" />;
    const retryButton = (
      <Button size="sm" variant="outline" onClick={() => refetch()}>
        다시 시도
      </Button>
    );
    return <StatusView message="정보를 불러오지 못했습니다." action={retryButton} />;
  }

  if (me.role === "CUSTOMER") {
    const storeLink = (
      <Link
        href="/"
        className="inline-flex h-8 items-center rounded-[2px] bg-ink px-3 text-[13px] text-white"
      >
        쇼핑몰로 가기
      </Link>
    );
    return <StatusView message="이 화면을 쓸 권한이 없습니다." action={storeLink} />;
  }

  return children;
}

function AccountInfo() {
  const { data: me } = useMe();
  const { mutate: logout, isPending } = useLogout();

  if (!me || me.role === "CUSTOMER") return null;

  return (
    <div className="flex items-center gap-3 text-[13px]">
      {/* ponytail: 내 정보 응답에 이메일이 없어 아이디를 보여준다 */}
      <span className="text-white/80">
        {me.userId} · {ROLE_LABEL[me.role]}
      </span>
      <button
        type="button"
        onClick={() => logout()}
        disabled={isPending}
        className="h-7 rounded-[2px] border border-white/40 px-2.5 text-xs hover:border-white disabled:opacity-50"
      >
        로그아웃
      </button>
    </div>
  );
}

// 관리 화면 틀: 검정 위 띠 56px + 왼쪽 메뉴 200px, 1024px 보다 좁으면 가로로 스크롤
export function AdminShell({ children }: { children: ReactNode }) {
  useAdminAuthGuard();

  return (
    <div className="flex min-h-screen min-w-[1024px] flex-col text-[13px]">
      <header className="flex h-14 shrink-0 items-center justify-between bg-ink px-5 text-white">
        <Link href="/admin" className="text-base font-bold">
          성원종합주방 관리
        </Link>
        <AccountInfo />
      </header>
      <div className="flex flex-1">
        <aside className="w-[200px] shrink-0 border-r border-line">
          <Suspense fallback={<AdminMenu />}>
            <AdminMenuWithPath />
          </Suspense>
        </aside>
        <main className="min-w-0 flex-1 p-6">
          <AdminContent>{children}</AdminContent>
        </main>
      </div>
    </div>
  );
}
