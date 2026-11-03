import type { ProductDto } from "@/entities/product";

export interface ListScreen {
  path: string;
  title: string;
  // 이 화면의 범위. 검색 결과는 범위가 없다
  scope?: ProductDto.Scope;
  // 범위 안의 판매 구분. 둘 이상이면 필터에서 골라 좁힐 수 있다
  salesTypes: ProductDto.SalesType[];
  // 검색 결과는 왼쪽 필터가 없다
  hasFilter: boolean;
  showSalesType: boolean;
}

export const LIST_SCREENS = {
  new: {
    path: "/product/new",
    title: "신제품",
    scope: "NEW",
    salesTypes: ["NEW"],
    hasFilter: true,
    showSalesType: false,
  },
  stock: {
    path: "/product/stock",
    title: "재고·중고품",
    scope: "STOCK",
    salesTypes: ["STOCK", "USED"],
    hasFilter: true,
    showSalesType: true,
  },
  search: {
    path: "/search",
    title: "검색 결과",
    salesTypes: [],
    hasFilter: false,
    showSalesType: true,
  },
} satisfies Record<string, ListScreen>;

export type ListScreenKey = keyof typeof LIST_SCREENS;
