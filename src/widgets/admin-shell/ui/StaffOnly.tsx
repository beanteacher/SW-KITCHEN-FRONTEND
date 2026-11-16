"use client";

import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { useMe } from "@/features/auth";
import { ApiError } from "@/shared/api";
import { ErrorView, StatusView } from "@/shared/ui";

interface Props {
  children: ReactNode;
}

// 직원(담당자·관리자)인지 확인한 뒤에야 관리 화면 틀까지 그린다. 고객에게는 없는 주소와 같은 404 를 보여
// 관리 화면이 있다는 것도 드러내지 않는다
export default function StaffOnly({ children }: Props) {
  const { data: me, error, isPending, refetch } = useMe();

  // 화면에서 막는 건 안내용이고, 실제로 막는 건 API 서버다
  // 확인하는 동안에도 화면 내용은 숨긴 채 그려 둔다. 안 그리면 Next 가 그 화면을 빼고 검사해 경고를 띄운다
  if (isPending) {
    return (
      <>
        <StatusView message="불러오는 중…" />
        <div hidden>{children}</div>
      </>
    );
  }

  if (error) {
    const unauthorized = error instanceof ApiError && error.status === 401;
    if (unauthorized) return <StatusView message="로그인 화면으로 이동합니다…" />;
    return (
      <ErrorView message="정보를 불러오지 못했습니다." onRetry={() => refetch()} variant="admin" />
    );
  }

  if (me.role === "CUSTOMER") notFound();

  return children;
}
