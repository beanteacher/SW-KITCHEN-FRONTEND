"use client";

import Link from "next/link";
import { ROLE_LABEL, useLogout, useMe } from "@/features/auth";

const BUTTON_CLASS =
  "flex h-7 items-center rounded-[2px] border border-white/40 px-2.5 text-xs hover:border-white disabled:opacity-50";

// 위 띠 오른쪽: 계정 아이디 · 역할 + [비밀번호 변경] [로그아웃]
export default function AccountInfo() {
  const { data: me } = useMe();
  const { mutate: logout, isPending } = useLogout();

  if (!me?.role || me.role === "CUSTOMER") return null;

  return (
    <div className="flex items-center gap-3 text-[13px]">
      <span className="text-white/80">
        {me.userId} · {ROLE_LABEL[me.role]}
      </span>
      <Link href="/admin/password" className={BUTTON_CLASS}>
        비밀번호 변경
      </Link>
      <button type="button" onClick={() => logout()} disabled={isPending} className={BUTTON_CLASS}>
        로그아웃
      </button>
    </div>
  );
}
