import type { ReactNode } from "react";

interface Props {
  message: string;
  action?: ReactNode;
}

// 불러오는 중, 결과 없음, 오류를 영역 가운데에 보여준다
export default function StatusView({ message, action }: Props) {
  return (
    <div
      role="status"
      className="flex min-h-60 flex-col items-center justify-center gap-4 text-sm text-gray-500"
    >
      <p>{message}</p>
      {action}
    </div>
  );
}
