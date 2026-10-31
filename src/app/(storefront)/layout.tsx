import type { ReactNode } from "react";
import { StoreFooter } from "@/widgets/store-footer";
import { StoreHeader } from "@/widgets/store-header";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StoreHeader />
      {/* 본문 너비는 화면마다 다르다 (목록은 1440px) */}
      <main className="min-h-[60vh]">{children}</main>
      <StoreFooter />
    </>
  );
}
