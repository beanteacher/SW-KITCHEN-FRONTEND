"use client";

import Link from "next/link";
import type { AuthDto } from "@/features/auth";
import { cn } from "@/shared/lib";

// 메뉴 묶음. 다른 기능을 만들면 묶음을 더한다. adminOnly 는 관리자에게만 보인다 (실제로 막는 건 서버다)
const MENU_GROUPS = [
  {
    title: "제품",
    items: [
      { href: "/admin/product", label: "제품 관리" },
      { href: "/admin/category", label: "분류 관리" },
    ],
  },
  {
    title: "회원",
    items: [
      { href: "/admin/member", label: "회원 목록" },
      { href: "/admin/staff", label: "직원 계정", adminOnly: true },
    ],
  },
];

interface Props {
  activePath?: string;
  role?: AuthDto.Role;
}

// 고른 메뉴는 회색 바탕 + 굵게 + 왼쪽 검정 막대
export default function AdminMenu({ activePath, role }: Props) {
  return (
    <nav aria-label="관리 메뉴">
      {MENU_GROUPS.map((group) => (
        <div key={group.title} className="[&+&]:mt-3">
          <p className="px-5 py-2 text-xs leading-[normal] font-semibold text-admin-muted">
            {group.title}
          </p>
          <ul>
            {group.items
              .filter((item) => !("adminOnly" in item) || role === "ADMIN")
              .map((item) => {
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
