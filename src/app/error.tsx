"use client";

import { Button, StatusView } from "@/shared/ui";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const retryButton = (
    <Button variant="outline" onClick={reset}>
      다시 시도
    </Button>
  );
  return <StatusView message="화면을 불러오지 못했습니다." action={retryButton} />;
}
