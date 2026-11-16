import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

interface Props {
  // [다시 불러오기] 같은 할 일 버튼
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

// 누른 동작이 실패했을 때 그 영역 위·아래에 남기는 빨간 안내. 다시 하거나 고칠 때까지 남는다 (frontend-feedback 규칙)
export default function AdminErrorNotice({ action, className, children }: Props) {
  return (
    <div
      role="alert"
      className={cn(
        "border border-[#f3b4b5] bg-[#fff5f5] px-4 py-3 leading-[1.6] text-[#b42318]",
        className,
      )}
    >
      {children}
      {action && <span className="ml-2">{action}</span>}
    </div>
  );
}
