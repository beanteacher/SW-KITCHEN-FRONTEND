"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib";

const MENU = [
  { href: "/product/new", label: "신제품" },
  { href: "/product/stock", label: "재고·중고품" },
];

// 지금 화면의 메뉴는 흰색 굵게, 나머지는 옅은 흰색
export function StoreNav({ activePath }: { activePath?: string }) {
  return (
    <nav aria-label="주 메뉴" className="flex h-full items-center">
      {MENU.map((item) => {
        const active = activePath?.startsWith(item.href) ?? false;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-full items-center px-1 text-xs xl:px-2 xl:text-base",
              active ? "font-bold text-white" : "font-medium text-white/80",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function StoreNavWithPath() {
  const pathname = usePathname();
  return <StoreNav activePath={pathname} />;
}
