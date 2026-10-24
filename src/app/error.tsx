"use client";

import { ErrorView } from "@/shared/ui";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ErrorView message="화면을 불러오지 못했습니다." onRetry={reset} />;
}
