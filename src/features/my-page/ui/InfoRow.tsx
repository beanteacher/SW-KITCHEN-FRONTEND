import type { ReactNode } from "react";

// 내 정보 표 한 줄: 왼쪽 이름 150px + 값. 640px 이하에서는 이름을 값 위로 올린다
export default function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-14 flex-col items-stretch gap-1.5 border-b border-[#ebebeb] px-1 py-3 sm:flex-row sm:items-center sm:gap-0 sm:py-2">
      <dt className="w-[150px] shrink-0 text-[13px] text-[#666] sm:text-sm">{label}</dt>
      <dd className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2.5 gap-y-1.5">{children}</dd>
    </div>
  );
}

export function InfoNote({ children }: { children: ReactNode }) {
  return <small className="text-xs text-placeholder">{children}</small>;
}

// 줄 오른쪽 작은 버튼. 좁은 화면에서는 값 아래 왼쪽으로 내려온다
export const ROW_BUTTON_CLASS =
  "h-8 rounded-[4px] border border-[#d0d0d0] bg-white px-3 text-[13px] whitespace-nowrap sm:ml-auto";
