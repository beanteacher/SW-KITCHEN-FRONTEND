import type { ReactNode } from "react";
import PageTitle from "../PageTitle";

interface Props {
  title: string;
  // 오른쪽 버튼 자리 (예: [+ 제품 등록], [목록으로])
  action?: ReactNode;
}

// 관리 화면 맨 위: 제목 + 아래 회색 선 + 오른쪽 버튼
export default function AdminPageHeader({ title, action }: Props) {
  return (
    <div className="mb-3 flex items-center justify-between border-b border-admin-line pb-3">
      <PageTitle title={title} variant="admin" />
      {action}
    </div>
  );
}
