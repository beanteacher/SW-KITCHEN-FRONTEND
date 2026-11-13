"use client";

import { cn } from "@/shared/lib";

interface Props {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

// 켜고 끄기 (40×22). 누르면 바로 저장한다
export default function MarketingSwitch({ checked, disabled, onChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="마케팅 정보 수신"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[22px] w-10 shrink-0 rounded-full transition-colors after:absolute after:top-[3px] after:left-[3px] after:size-4 after:rounded-full after:bg-white after:transition-[left]",
        checked ? "bg-black after:left-[21px]" : "bg-[#ccc]",
      )}
    />
  );
}
