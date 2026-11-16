"use client";

import ServerError from "./ServerError";
import "./globals.css";

// 맨 바깥 틀(layout)까지 깨졌을 때의 마지막 대비 화면. 틀 대신 html·body 를 직접 그린다
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="ko">
      <body className="font-sans">
        <ServerError onRetry={reset} />
      </body>
    </html>
  );
}
