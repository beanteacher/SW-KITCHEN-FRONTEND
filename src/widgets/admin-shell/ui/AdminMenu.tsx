"use client";

import Link from "next/link";
import { cn } from "@/shared/lib";

// 메뉴 묶음. 다른 기능을 만들면 묶음을 더한다
const MENU_GROUPS = [
  {
    title: "제품",
    items: [
      { href: "/admin/product", label: "제품 관리" },
      { href: "/admin/category", label: "분류 관리" },
    ],
  },
];

interface Props {
  activePath?: string;
}

// 고른 메뉴는 회색 바탕 + 굵게 + 왼쪽 검정 막대
export default function AdminMenu({ activePath }: Props) {
  return (
    <nav aria-label="관리 메뉴">
      {MENU_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="px-5 py-2 text-xs leading-[normal] font-semibold text-admin-muted">
            {group.title}
          </p>
          <ul>
            {group.items.map((item) => {
              const active = activePath?.startsWith(item.href) ?? false;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block px-5 py-2.5 text-sm leading-[normal]",
                      active
                        ? "bg-admin-cell-vline font-bold text-black shadow-[inset_3px_0_0_var(--color-ink)]"
                        : "text-admin-text hover:bg-gray-50",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
