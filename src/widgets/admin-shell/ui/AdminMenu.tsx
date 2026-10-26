"use client";

import Link from "next/link";
import { cn } from "@/shared/lib";

const MENU = [
  { href: "/admin/product", label: "제품 관리" },
  { href: "/admin/category", label: "분류 관리" },
];

interface Props {
  activePath?: string;
}

export default function AdminMenu({ activePath }: Props) {
  return (
    <nav aria-label="관리 메뉴">
      <ul className="py-2">
        {MENU.map((item) => {
          const active = activePath?.startsWith(item.href) ?? false;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block px-5 py-2.5 text-[13px]",
                  active ? "bg-gray-100 font-bold text-ink" : "text-gray-600 hover:bg-gray-50",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
