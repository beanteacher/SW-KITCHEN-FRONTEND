import { ChevronUp, RotateCw } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { MATERIAL_LABEL, type ProductDto, SALES_TYPE_LABEL } from "@/entities/product";
import type { ListScreen } from "../config/listScreens";
import { type ProductListQuery, toggle, toProductListHref } from "../lib/productListQuery";
import FilterRow from "./FilterRow";

interface Props {
  screen: ListScreen;
  query: ProductListQuery;
  filter: ProductDto.Filter;
}

// 접고 펴는 구역. 처음에는 펼쳐 둔다
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="group border-b border-[#eee] pb-3.5 open:pb-3.5 [&:not([open])]:pb-0">
      <summary className="flex h-[52px] cursor-pointer list-none items-center justify-between text-base font-semibold text-[#333] [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronUp
          className="size-4 transition-transform group-[:not([open])]:rotate-180"
          aria-hidden
        />
      </summary>
      {children}
    </details>
  );
}

// 컬리형 왼쪽 필터: 카테고리(하나만) · 판매 구분(재고·중고품만) · 재질(여러 개). 고르면 1페이지로 돌아간다
export default function ProductFilter({ screen, query, filter }: Props) {
  const hrefWith = (next: Partial<ProductListQuery>) =>
    toProductListHref(screen.path, { ...query, ...next, page: 1 });

  const categories = filter.categories ?? [];
  const pickedBig = categories.find(
    (big) =>
      big.id === query.categoryId || big.children?.some((mid) => mid.id === query.categoryId),
  );
  const isFiltered =
    query.categoryId !== null || query.salesTypes.length > 0 || query.materials.length > 0;
  // 재고·중고품 화면에서만 고를 수 있는 판매 구분
  const salesTypeRows = screen.salesTypes.length > 1 ? (filter.salesTypes ?? []) : [];

  return (
    <div>
      <div className="flex items-center justify-between border-b border-[#eee] pb-5">
        <h2 className="text-lg font-semibold text-[#464c52]">필터</h2>
        {isFiltered ? (
          <Link
            href={hrefWith({ categoryId: null, salesTypes: [], materials: [] })}
            scroll={false}
            className="flex items-center gap-[5px] text-sm font-semibold text-[#333]"
          >
            <RotateCw className="size-3.5" aria-hidden />
            초기화
          </Link>
        ) : (
          <span className="flex items-center gap-[5px] text-sm font-semibold text-[#ddd]">
            <RotateCw className="size-3.5" aria-hidden />
            초기화
          </span>
        )}
      </div>

      <Section title="카테고리">
        <FilterRow
          shape="radio"
          label="전체"
          count={filter.total}
          selected={query.categoryId === null}
          href={hrefWith({ categoryId: null })}
        />
        {categories.map((big) => (
          <div key={big.id}>
            <FilterRow
              shape="radio"
              label={big.name ?? ""}
              count={big.productCount}
              selected={big.id === query.categoryId}
              href={hrefWith({ categoryId: big.id })}
            />
            {big.id === pickedBig?.id &&
              big.children?.map((mid) => (
                <FilterRow
                  key={mid.id}
                  indent
                  shape="radio"
                  label={mid.name ?? ""}
                  count={mid.productCount}
                  selected={mid.id === query.categoryId}
                  href={hrefWith({ categoryId: mid.id })}
                />
              ))}
          </div>
        ))}
      </Section>

      {salesTypeRows.length > 0 && (
        <Section title="판매 구분">
          {salesTypeRows
            .filter(({ code }) => screen.salesTypes.includes(code))
            .map(({ code, productCount }) => (
              <FilterRow
                key={code}
                shape="checkbox"
                label={SALES_TYPE_LABEL[code]}
                count={productCount}
                selected={query.salesTypes.includes(code)}
                href={hrefWith({ salesTypes: toggle(query.salesTypes, code) })}
              />
            ))}
        </Section>
      )}

      <Section title="재질">
        {(filter.materials ?? []).map(({ code, productCount }) => (
          <FilterRow
            key={code}
            shape="checkbox"
            label={MATERIAL_LABEL[code]}
            count={productCount}
            selected={query.materials.includes(code)}
            href={hrefWith({ materials: toggle(query.materials, code) })}
          />
        ))}
      </Section>
    </div>
  );
}
