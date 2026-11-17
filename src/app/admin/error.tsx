"use client";

import { AdminErrorPage } from "@/widgets/admin-shell";

// 관리 화면 본문에서 난 오류. 틀(위 띠·왼쪽 메뉴)은 그대로 둔다
export default function AdminError() {
  return (
    <AdminErrorPage title="화면을 불러오지 못했습니다.">
      잠시 뒤 다시 시도해 주세요.
      <br />
      계속되면 시스템 담당자에게 알려 주세요.
    </AdminErrorPage>
  );
}
