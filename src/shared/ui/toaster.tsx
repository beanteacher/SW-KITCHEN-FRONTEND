"use client";

import { cn, useToastStore } from "@/shared/lib";

// 앱 전체에 한 번만 붙인다
export function Toaster() {
  const items = useToastStore((state) => state.items);

  return (
    <div aria-live="polite" className="fixed top-4 right-4 z-50 flex flex-col gap-2">
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
