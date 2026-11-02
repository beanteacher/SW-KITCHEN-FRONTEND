import Link from "next/link";
import type { ReactNode } from "react";
import { ProductApi, ProductCard, type ProductDto } from "@/entities/product";
import type { PageResponse } from "@/shared/api";
import { buttonClass, Pagination, RefreshErrorView, StatusView } from "@/shared/ui";
import { LIST_SCREENS, type ListScreen, type ListScreenKey } from "../config/listScreens";
import {
  parseProductListQuery,
  type ProductListQuery,
  toProductListHref,
  toUrlSearchParams,
  withCategory,
} from "../lib/productListQuery";
import ProductFilter from "./ProductFilter";
import SortTabs from "./SortTabs";

// 36 은 4·3·2·1 칸 어느 너비에서도 마지막 줄이 비지 않는다
const PAGE_SIZE = 36;

interface Props {
  screen: ListScreenKey;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// 현재 위치: 화면 이름 > 대분류 > 중분류. 대분류를 누르면 그 대분류로 거른다
function Crumb({
  title,
  path,
  query,
  categories,
}: {
  title: string;
  path: string;
  query: ProductListQuery;
  categories: ProductDto.FilterCategory[];
}) {
  const big = categories.find(
    (item) =>
      item.id === query.categoryId || item.children?.some((mid) => mid.id === query.categoryId),
  );
  const mid = big?.children?.find((item) => item.id === query.categoryId);
  const separator = <span className="mx-1.5 text-[#b3b3b3]">&gt;</span>;

  return (
    <nav aria-label="현재 위치" className="mb-3.5 text-[#666]">
      <h1 className="inline">{title}</h1>
      {big && (
        <>
          {separator}
          {mid ? (
            <Link href={toProductListHref(path, withCategory(query, big.id))}>{big.name}</Link>
          ) : (
            <strong className="text-black">{big.name}</strong>
          )}
        </>
      )}
      {mid && (
        <>
          {separator}
          <strong className="text-black">{mid.name}</strong>
        </>
      )}
    </nav>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1440px] px-5 pt-4 pb-10">{children}</div>;
}

// 신제품 · 재고·중고품 · 검색 결과가 같이 쓰는 목록. 조건은 모두 주소에서 읽고 서버에서 그린다
export default async function ProductListView({ screen: screenKey, searchParams }: Props) {
  const screen: ListScreen = LIST_SCREENS[screenKey];
  const parsed = parseProductListQuery(toUrlSearchParams(await searchParams));
  const isSearch = !screen.hasFilter;
  // 화면에 없는 조건은 버린다 (검색은 검색어만, 목록은 검색어 없이). 판매 구분은 재고·중고품 안에서만 좁힌다
  const query: ProductListQuery = {
    ...parsed,
    keyword: isSearch ? parsed.keyword : "",
    categoryId: isSearch ? null : parsed.categoryId,
    materials: isSearch ? [] : parsed.materials,
    salesTypes:
      screen.salesTypes.length > 1
        ? parsed.salesTypes.filter((salesType) => screen.salesTypes.includes(salesType))
        : [],
  };
  const title = isSearch ? `‘${query.keyword}’ 검색 결과` : screen.title;

  if (isSearch && !query.keyword) {
    return (
      <Frame>
        <StatusView message="검색어를 입력해 주세요." />
      </Frame>
    );
  }

  const params: ProductDto.SearchParams = {
    scope: screen.scope,
    salesType: query.salesTypes,
    categoryId: query.categoryId ?? undefined,
    materials: query.materials,
    keyword: query.keyword,
    orderBy: query.orderBy,
    page: query.page,
    size: PAGE_SIZE,
  };

  let products: PageResponse<ProductDto.Summary>;
  let filter: ProductDto.Filter | null;
  try {
    [products, filter] = await Promise.all([
      ProductApi.list(params),
      screen.hasFilter ? ProductApi.filter(params) : null,
    ]);
    // 주소를 고쳐 없는 페이지로 오면 마지막 페이지를 보여준다
    if (products.totalPages > 0 && query.page > products.totalPages) {
      query.page = products.totalPages;
      products = await ProductApi.list({ ...params, page: query.page });
    }
  } catch {
    return (
      <Frame>
        <h1 className="mb-3.5 text-[#666]">{title}</h1>
        <RefreshErrorView message="제품을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요" />
      </Frame>
    );
  }

  const isFiltered =
    query.categoryId !== null || query.salesTypes.length > 0 || query.materials.length > 0;
  const resetHref = toProductListHref(screen.path, {
    ...query,
    categoryId: null,
    salesTypes: [],
    materials: [],
    page: 1,
  });

  const list = (
    <section aria-label="제품 목록">
      <SortTabs path={screen.path} query={query} total={products.totalElements} />
      {products.content.length === 0 ? (
        <StatusView
          message={
            isSearch ? `‘${query.keyword}’에 맞는 제품이 없습니다` : "조건에 맞는 제품이 없습니다"
          }
          action={
            isFiltered && (
              <Link href={resetHref} className={buttonClass()}>
                필터 초기화
              </Link>
            )
          }
        />
      ) : (
        <ul className="grid grid-cols-1 gap-x-[18px] gap-y-[31px] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.content.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} showSalesType={screen.showSalesType} />
            </li>
          ))}
        </ul>
      )}
      <div className="mt-[60px]">
        <Pagination
          page={query.page}
          totalPages={products.totalPages}
          getHref={(page) => toProductListHref(screen.path, { ...query, page })}
        />
      </div>
    </section>
  );

  return (
    <Frame>
      <Crumb title={title} path={screen.path} query={query} categories={filter?.categories ?? []} />
      {filter ? (
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* 넓은 화면은 필터가 스크롤을 따라오고, 화면보다 길면 필터 안에서 스크롤된다 */}
          {/* ponytail: 1024px 보다 좁으면 필터를 목록 위에 그냥 쌓는다. 모바일 화면을 다듬을 때 [필터] 버튼 + 옆 패널로 바꾼다 */}
          <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-32px)] lg:self-start lg:overflow-y-auto">
            <ProductFilter screen={screen} query={query} filter={filter} />
          </aside>
          {list}
        </div>
      ) : (
        list
      )}
    </Frame>
  );
}
