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
      <button type="button" onClick={() => logout()} disabled={isPending} className={BUTTON_CLASS}>
        로그아웃
      </button>
    );
  }

  return (
    <Link href="/login" className={BUTTON_CLASS}>
      <span className="hidden xl:inline">로그인 / 회원가입</span>
      <span className="xl:hidden">로그인</span>
    </Link>
  );
}
