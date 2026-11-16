"use client";

import ServerError from "./ServerError";

// 쇼핑몰 틀 밖(로그인·가입·관리 등)에서 난 오류
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <ServerError onRetry={reset} />;
}
