"use client";

import { useRouter } from "next/navigation";
import { ErrorView } from "@/shared/ui";

// 서버에서 목록을 못 불러왔을 때. [다시 시도]는 이 화면을 서버에서 다시 그린다
export default function ListErrorView() {
  const router = useRouter();
  return (
    <ErrorView
      message="제품을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요"
      onRetry={() => router.refresh()}
    />
  );
}
