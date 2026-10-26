"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { setAuthFailureHandler } from "@/shared/api";
import { toast } from "@/shared/lib";

// 로그인이 풀리면 지금 주소를 붙여 로그인 화면으로 보낸다
export function useAdminAuthGuard() {
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
