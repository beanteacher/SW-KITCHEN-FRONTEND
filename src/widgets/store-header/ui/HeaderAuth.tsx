"use client";

import Link from "next/link";
import { useLogout, useMe } from "@/features/auth";

// 로그인 전 [로그인 / 회원가입], 로그인 뒤 같은 자리·같은 모양으로 [로그아웃] (무신사와 같음)
const BUTTON_CLASS =
  "ml-1 flex h-6 items-center rounded-[4px] border border-white/80 px-1.5 text-[11px] font-medium text-white/80 xl:text-[13px]";

export default function HeaderAuth() {
  // 쿠키는 자바스크립트가 못 읽으므로 서버에 물어본다. 묻는 동안·실패하면 로그인 버튼을 둔다
  const { data: me } = useMe();
  const { mutate: logout, isPending } = useLogout();

  if (me) {
    return (
      <>
        {/* 고객만 [마이]. 직원은 마이페이지가 없다 */}
        {me.role === "CUSTOMER" && (
          <Link
            href="/my"
            className="flex h-full items-center gap-0.5 px-1 text-xs font-medium text-white/80 xl:px-1.5 xl:text-sm"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              className="hidden size-4 xl:block"
              aria-hidden
            >
              <circle cx="8" cy="5.5" r="2.8" />
              <path d="M2.8 14c.6-2.7 2.7-4.3 5.2-4.3s4.6 1.6 5.2 4.3" />
            </svg>
            마이
          </Link>
        )}
        <button
          type="button"
          onClick={() => logout()}
          disabled={isPending}
          className={BUTTON_CLASS}
        >
          로그아웃
        </button>
      </>
    );
  }

  return (
    <Link href="/login" className={BUTTON_CLASS}>
      <span className="hidden xl:inline">로그인 / 회원가입</span>
      <span className="xl:hidden">로그인</span>
    </Link>
  );
}
