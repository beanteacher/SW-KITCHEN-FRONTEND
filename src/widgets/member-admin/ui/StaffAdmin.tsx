"use client";

import { useMe } from "@/features/auth";
import { StaffManager } from "@/features/staff-admin";
import { StatusView } from "@/shared/ui";

// 직원 계정은 관리자만. 담당자가 주소로 들어오면 권한 없음 화면 (실제로 막는 건 서버다)
export default function StaffAdmin() {
  const { data: me } = useMe();

  if (!me) return null;
  if (me.role !== "ADMIN") return <StatusView message="이 화면을 쓸 권한이 없습니다." />;
  return <StaffManager myId={me.id} />;
}
