"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { setAuthFailureHandler } from "@/shared/api";

// 로그인이 풀리면 지금 주소를 붙여 로그인 화면으로 보낸다.
// 권한 없음(403)은 여기서 알리지 않는다. 실패한 동작마다 제 자리에 오류를 남기고, 고객에게는 관리 화면이 있다는 것도 드러내지 않는다
export function useAdminAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    setAuthFailureHandler((status) => {
      if (status !== 401) return;
      const here = `${window.location.pathname}${window.location.search}`;
      router.replace(`/login?redirect=${encodeURIComponent(here)}`);
    });
    return () => setAuthFailureHandler(null);
  }, [router]);
}
