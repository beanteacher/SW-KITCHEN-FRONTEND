"use client";

import { keepPreviousData, skipToken, useQuery } from "@tanstack/react-query";
import { ProductApi } from "../api/productApi";
import type { ProductDto } from "./dto/productDto";

// 쿼리 키 팩토리. 제품을 저장한 뒤에는 all 로 한꺼번에 다시 읽는다
export const productKeys = {
  all: ["product"] as const,
  adminList: (params: ProductDto.AdminSearchParams) =>
    [...productKeys.all, "admin-list", params] as const,
  adminDetails: () => [...productKeys.all, "admin-detail"] as const,
  adminDetail: (id: number | null) => [...productKeys.adminDetails(), id] as const,
};

// 수정 화면용 제품 전체. id 가 없으면(등록 화면) 부르지 않는다
export const useAdminProduct = (id: number | null) => {
  return useQuery({
    queryKey: productKeys.adminDetail(id),
    queryFn: id === null ? skipToken : () => ProductApi.adminDetail(id),
  });
};

// 관리 목록. 조건을 바꿔 다시 읽는 동안 이전 목록을 그대로 둔다
export const useAdminProducts = (params: ProductDto.AdminSearchParams) => {
  return useQuery({
    queryKey: productKeys.adminList(params),
    queryFn: () => ProductApi.adminList(params),
    placeholderData: keepPreviousData,
  });
};
