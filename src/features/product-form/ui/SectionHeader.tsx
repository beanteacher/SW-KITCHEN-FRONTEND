import type { ReactNode } from "react";

interface Props {
  title: string;
  required?: boolean;
  // 오른쪽 회색 안내
  note?: ReactNode;
}

// 구역 제목 줄: 왼쪽 굵은 제목, 오른쪽 짧은 회색 안내
export default function SectionHeader({ title, required, note }: Props) {
  return (
    <div className="mt-6 mb-2 flex items-baseline justify-between gap-4">
      <h2 className="text-[15px] leading-[normal] font-bold">
        {title}
        {required && <span className="ml-0.5 text-admin-error">*</span>}
      </h2>
      {note && <span className="text-xs text-admin-muted">{note}</span>}
    </div>
  );
}
