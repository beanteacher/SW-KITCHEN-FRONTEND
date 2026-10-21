import type { ReactNode } from "react";
import { StoreFooter } from "@/widgets/store-footer";
import { StoreHeader } from "@/widgets/store-header";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StoreHeader />
      <main className="mx-auto min-h-[60vh] max-w-[1050px] px-4 py-10">{children}</main>
      <StoreFooter />
    </>
  );
}
