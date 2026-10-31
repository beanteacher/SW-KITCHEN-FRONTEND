import { apiRequest, type PageResponse } from "@/shared/api";
import type { ProductDto } from "../model/dto/productDto";

export * as ProductApi from "./productApi";

const ADMIN_BASE_URL = "admin/product";

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
