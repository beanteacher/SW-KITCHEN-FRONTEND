import type { ReactNode } from "react";
import { cn } from "@/shared/lib";

// 입력칸 아래 회색 안내 한 줄. info 는 바꾸면 무엇이 달라지는지 알리는 파란 안내
const TONE = {
  muted: "text-admin-muted",
  info: "text-[#2357c6]",
};

interface Props {
  tone?: keyof typeof TONE;
  children: ReactNode;
}

export default function AdminHint({ tone = "muted", children }: Props) {
  return <p className={cn("mt-1 text-xs", TONE[tone])}>{children}</p>;
}
