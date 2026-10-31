import Link from "next/link";
import type { ProductDto } from "@/entities/product";
import { cn, formatNumber } from "@/shared/lib";
import { ORDER_BY_LABEL, type ProductListQuery, toProductListHref } from "../lib/productListQuery";

const ORDER_BYS = Object.keys(ORDER_BY_LABEL) as ProductDto.OrderBy[];

interface Props {
  path: string;
  query: ProductListQuery;
  total: number;
}

// 정렬 탭 4개 + 오른쪽 제품 수. 정렬을 바꾸면 1페이지로 돌아간다
export default function SortTabs({ path, query, total }: Props) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-2.5 border-b border-[#ebebeb] pb-3">
      <nav aria-label="정렬" className="flex flex-wrap gap-1">
        {ORDER_BYS.map((orderBy) => (
          <Link
            key={orderBy}
            href={toProductListHref(path, { ...query, orderBy, page: 1 })}
            scroll={false}
            aria-current={orderBy === query.orderBy ? "true" : undefined}
            className={cn(
              "px-2 py-1 text-[#666] [&+&]:border-l [&+&]:border-[#ebebeb]",
              orderBy === query.orderBy && "font-bold text-black",
            )}
          >
            {ORDER_BY_LABEL[orderBy]}
          </Link>
        ))}
      </nav>
      <span className="text-[#666]">총 {formatNumber(total)}개</span>
    </div>
  );
}
