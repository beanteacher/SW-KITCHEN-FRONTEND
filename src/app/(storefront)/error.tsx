"use client";

import ServerError from "../ServerError";

// 쇼핑몰 화면에서 난 오류. 머리글·바닥글은 그대로 두고 본문만 바꾼다
export default function StorefrontError({ reset }: { error: Error; reset: () => void }) {
  return <ServerError onRetry={reset} />;
}
