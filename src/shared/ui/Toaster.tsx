"use client";

import { cn, useToastStore } from "@/shared/lib";

// 앱 전체에 한 번만 붙인다. 화면 아래 가운데에 뜬다 (시안과 같은 자리)
export default function Toaster() {
  const items = useToastStore((state) => state.items);

  return (
    <div
      aria-live="polite"
      className="fixed bottom-10 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      {items.map((item) => (
        <div
          key={item.id}
          role={item.kind === "error" ? "alert" : "status"}
          className={cn(
            "min-w-60 rounded-md px-4 py-3 text-sm text-white shadow-lg",
            item.kind === "error" ? "bg-danger" : "bg-ink",
          )}
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
