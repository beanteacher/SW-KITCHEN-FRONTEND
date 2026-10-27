import type { ReactNode } from "react";

interface Props {
  id?: string;
  children: ReactNode;
}

// 입력칸 바로 아래 빨간 글씨 한 줄
export default function AdminFieldError({ id, children }: Props) {
  return (
    <p id={id} role="alert" className="mt-1 text-xs text-admin-error">
      {children}
    </p>
  );
}
