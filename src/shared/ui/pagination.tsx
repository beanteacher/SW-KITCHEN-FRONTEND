import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn, getPageWindow } from "@/shared/lib";

// md 는 쇼핑몰(34px 칸), sm 은 관리자(28px 칸)
const SIZE = {
  md: "size-[34px] text-sm",
  sm: "size-7 text-xs",
};

interface PaginationProps {
  page: number;
  totalPages: number;
  // 페이지 번호는 주소에 남긴다. 링크로 옮기면 Next 가 맨 위로 올려 준다
  getHref: (page: number) => string;
  size?: keyof typeof SIZE;
}

export function Pagination({ page, totalPages, getHref, size = "md" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageWindow(page, totalPages);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;
  // 칸을 테두리끼리 붙여 놓는다
  const cell = cn(
    "-ml-px flex items-center justify-center border border-cell first:ml-0",
    SIZE[size],
  );

  const arrow = (target: number, enabled: boolean, label: string, icon: ReactNode) =>
    enabled ? (
      <Link href={getHref(target)} aria-label={label} className={cn(cell, "hover:bg-gray-50")}>
        {icon}
      </Link>
    ) : (
      <span aria-hidden className={cn(cell, "text-gray-300")}>
        {icon}
      </span>
    );

  return (
    <nav aria-label="페이지" className="flex justify-center">
      {arrow(1, !isFirst, "첫 페이지", <ChevronsLeft className="size-4" />)}
      {arrow(page - 1, !isFirst, "이전 페이지", <ChevronLeft className="size-4" />)}
      {pages.map((number) => (
        <Link
          key={number}
          href={getHref(number)}
          aria-current={number === page ? "page" : undefined}
          className={cn(cell, number === page ? "bg-gray-100 font-bold" : "hover:bg-gray-50")}
        >
          {number}
        </Link>
      ))}
      {arrow(page + 1, !isLast, "다음 페이지", <ChevronRight className="size-4" />)}
      {arrow(totalPages, !isLast, "마지막 페이지", <ChevronsRight className="size-4" />)}
    </nav>
  );
}
