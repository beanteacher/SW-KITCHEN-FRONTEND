import { MATERIAL_LABEL, type ProductDto, SALES_TYPE_LABEL } from "@/entities/product";

export interface ProductListQuery {
  keyword: string;
  categoryId: number | null;
  salesTypes: ProductDto.SalesType[];
  materials: ProductDto.Material[];
  orderBy: ProductDto.OrderBy;
  page: number;
}

export const ORDER_BY_LABEL: Record<ProductDto.OrderBy, string> = {
  POPULAR: "인기순",
  NEWEST: "신규 등록순",
  PRICE_ASC: "낮은 가격순",
  PRICE_DESC: "높은 가격순",
};

const DEFAULT_ORDER_BY: ProductDto.OrderBy = "POPULAR";

const isKeyOf =
  <K extends string>(record: Record<K, string>) =>
  (value: string | null): value is K =>
    value !== null && Object.hasOwn(record, value);

const isSalesType = isKeyOf(SALES_TYPE_LABEL);
const isMaterial = isKeyOf(MATERIAL_LABEL);
const isOrderBy = isKeyOf(ORDER_BY_LABEL);

// Next 가 넘겨주는 주소 조건(값이 하나 또는 여럿)을 URLSearchParams 로 바꾼다
export function toUrlSearchParams(record: Record<string, string | string[] | undefined>) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    for (const item of [value ?? []].flat()) searchParams.append(key, item);
  }
  return searchParams;
}

// 주소를 손으로 고쳐 이상한 값이 들어오면 그 조건은 없는 것으로 본다. 겹친 값은 하나로 줄인다
export function parseProductListQuery(searchParams: URLSearchParams): ProductListQuery {
  const categoryId = Number(searchParams.get("categoryId"));
  const page = Number(searchParams.get("page"));
  const orderBy = searchParams.get("orderBy");
  return {
    keyword: searchParams.get("keyword")?.trim() ?? "",
    categoryId: Number.isInteger(categoryId) && categoryId > 0 ? categoryId : null,
    salesTypes: [...new Set(searchParams.getAll("salesType").filter(isSalesType))],
    materials: [...new Set(searchParams.getAll("materials").filter(isMaterial))],
    orderBy: isOrderBy(orderBy) ? orderBy : DEFAULT_ORDER_BY,
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

// 빈 값·인기순·1페이지는 주소에서 뺀다
export function toProductListHref(path: string, query: ProductListQuery) {
  const searchParams = new URLSearchParams();
  if (query.keyword) searchParams.set("keyword", query.keyword);
  if (query.categoryId) searchParams.set("categoryId", String(query.categoryId));
  query.salesTypes.forEach((salesType) => searchParams.append("salesType", salesType));
  query.materials.forEach((material) => searchParams.append("materials", material));
  if (query.orderBy !== DEFAULT_ORDER_BY) searchParams.set("orderBy", query.orderBy);
  if (query.page > 1) searchParams.set("page", String(query.page));
  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

// 분류를 바꾼다. 재질·판매 구분 개수는 분류에 따라 달라지므로 둘 다 지우고 새 분류에서 다시 고르게 한다
export function withCategory(query: ProductListQuery, categoryId: number | null) {
  return { ...query, categoryId, salesTypes: [], materials: [], page: 1 };
}

// 목록에 넣었다 뺐다 한다 (재질·판매 구분 네모 상자)
export function toggle<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((value) => value !== item) : [...list, item];
}
