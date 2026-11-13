import type { ReactNode } from "react";

// 단계 제목 18px + 안내 한 줄 13px
export default function SignupHeading({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <>
      <h2 className="mb-1.5 text-lg leading-[26px] font-semibold">{title}</h2>
      {children && <p className="mb-6 text-[13px] leading-5 text-[#666]">{children}</p>}
    </>
  );
}
