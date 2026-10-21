import type { ReactNode } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/shared/ui";
import { Providers } from "./providers";
import "./globals.css";

// 맥·윈도우 어디서든 같은 글꼴로 보이게, 기기에 깔린 글꼴 대신 이 파일을 내려 준다
const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  weight: "45 920",
  display: "swap",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "성원종합주방",
  description: "업소용 주방기기 신제품, 재고품, 중고품",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="font-sans">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
