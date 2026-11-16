"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

interface Props {
  className?: string;
  children: ReactNode;
}

// 이전 화면으로. 주소를 바로 쳐서 들어와 돌아갈 곳이 없으면 쇼핑몰 첫 화면으로 간다
export default function BackButton({ className, children }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
    >
      {children}
    </button>
  );
}
