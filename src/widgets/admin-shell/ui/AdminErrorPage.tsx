import type { ReactNode } from "react";
import { BackButton } from "@/shared/ui";
import { adminButtonClass } from "@/shared/ui/admin";

interface Props {
  title: string;
  children: ReactNode;
}

// 관리 화면 오류. 틀은 그대로 두고 본문 가운데에 글 + [이전 화면] 하나. 404·500 이 같이 쓴다
export default function AdminErrorPage({ title, children }: Props) {
  return (
    <div className="py-[120px] text-center leading-[21px] text-admin-sub">
      <h1 className="mb-2 text-[15px] font-bold text-ink">{title}</h1>
      <p>{children}</p>
      <div className="mt-4 flex justify-center">
        <BackButton className={adminButtonClass({ variant: "outline" })}>이전 화면</BackButton>
      </div>
    </div>
  );
}
