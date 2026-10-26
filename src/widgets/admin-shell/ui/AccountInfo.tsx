"use client";

import { ROLE_LABEL, useLogout, useMe } from "@/features/auth";

// 위 띠 오른쪽: 계정 아이디 · 역할 + [로그아웃]
export default function AccountInfo() {
  const { data: me } = useMe();
  const { mutate: logout, isPending } = useLogout();

  if (!me?.role || me.role === "CUSTOMER") return null;

  return (
    <div className="flex items-center gap-3 text-[13px]">
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
