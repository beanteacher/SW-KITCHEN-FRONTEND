import { apiRequest, type PageResponse } from "@/shared/api";
import type { ProductDto } from "../model/dto/productDto";

export * as ProductApi from "./productApi";

const BASE_URL = "product";
const ADMIN_BASE_URL = "admin/product";

// 여러 개인 값(salesType·materials)은 같은 이름으로 여러 번 보낸다. 빈 값은 보내지 않는다
function toSearchParams(params: ProductDto.SearchParams) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    for (const item of [value].flat()) {
      if (item !== undefined && item !== "") searchParams.append(key, String(item));
    }
  }
  return searchParams;
}

// 쇼핑몰 목록·검색
export const list = (params: ProductDto.SearchParams) =>
  apiRequest<PageResponse<ProductDto.Summary>>(BASE_URL, { searchParams: toSearchParams(params) });

// 목록 왼쪽 필터 (줄마다 제품 수)
export const filter = ({ scope, salesType, categoryId, materials }: ProductDto.SearchParams) =>
  apiRequest<ProductDto.Filter>(`${BASE_URL}/filter`, {
    searchParams: toSearchParams({ scope, salesType, categoryId, materials }),
  });

// 쇼핑몰 상세. 모든 옵션이 품절이어도 열린다
export const detail = (id: number) => apiRequest<ProductDto.Detail>(`${BASE_URL}/${id}`);

// 관리 목록. 새로 등록한 순. 빈 조건은 보내지 않는다
export const adminList = ({
  keyword,
  categoryId,
  salesType,
  page,
  size,
}: ProductDto.AdminSearchParams) =>
  apiRequest<PageResponse<ProductDto.AdminSummary>>(ADMIN_BASE_URL, {
    searchParams: {
      page,
      size,
      ...(keyword && { keyword }),
      ...(categoryId && { categoryId }),
      ...(salesType && { salesType }),
    },
  });

export const adminDetail = (id: number) =>
  apiRequest<ProductDto.AdminDetail>(`${ADMIN_BASE_URL}/${id}`);
