import { type ProductDto, SALES_TYPE_LABEL } from "@/entities/product";

export interface ProductListFilters {
  keyword: string;
  categoryId: number | null;
  salesType: ProductDto.SalesType | null;
  page: number;
}

const isSalesType = (value: string | null): value is ProductDto.SalesType =>
  value !== null && Object.hasOwn(SALES_TYPE_LABEL, value);

// 주소를 손으로 고쳐 이상한 값이 들어오면 그 조건은 없는 것으로 본다
export function parseProductListFilters(searchParams: URLSearchParams): ProductListFilters {
  const salesType = searchParams.get("salesType");
  const categoryId = Number(searchParams.get("categoryId"));
  const page = Number(searchParams.get("page"));
  return {
    keyword: searchParams.get("keyword") ?? "",
    categoryId: Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null,
    salesType: isSalesType(salesType) ? salesType : null,
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

// 빈 값과 1페이지는 주소에서 뺀다
export function toProductListQuery({ keyword, categoryId, salesType, page }: ProductListFilters) {
  const params = new URLSearchParams();
  if (keyword) params.set("keyword", keyword);
  if (categoryId) params.set("categoryId", String(categoryId));
  if (salesType) params.set("salesType", salesType);
  if (page > 1) params.set("page", String(page));
  return params.toString();
}
