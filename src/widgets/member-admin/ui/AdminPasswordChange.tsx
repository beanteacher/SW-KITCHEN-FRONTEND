"use client";

import { useMe } from "@/features/auth";
import { AdminPasswordChangeForm } from "@/features/password-change";

// 내 비밀번호 변경. 아이디는 로그인한 계정에서 읽는다
export default function AdminPasswordChange() {
  const { data: me } = useMe();

  if (!me?.userId) return null;
  return <AdminPasswordChangeForm userId={me.userId} />;
}
