"use client";

import Link from "next/link";
import { CUSTOMER_CENTER } from "@/shared/config";
import { ErrorScreen, errorButtonClass } from "@/shared/ui";

// 화면을 그리다 난 예상하지 못한 오류. 쇼핑몰 안·밖과 마지막 대비 화면이 같이 쓴다
export default function ServerError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorScreen
      kind="error"
      title="잠시 문제가 생겼습니다."
      actions={
        <>
          <button type="button" className={errorButtonClass()} onClick={onRetry}>
            다시 시도
          </button>
          <Link href="/" className={errorButtonClass("line")}>
            쇼핑몰 첫 화면
          </Link>
        </>
      }
    >
      화면을 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요.
      <br />
      계속되면 고객센터 {CUSTOMER_CENTER.phone} ({CUSTOMER_CENTER.hours})으로 알려 주세요.
    </ErrorScreen>
  );
}
