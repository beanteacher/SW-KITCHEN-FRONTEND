"use client";

import { useQuery } from "@tanstack/react-query";
import { CategoryApi } from "../api/categoryApi";

// 쿼리 키 팩토리. 분류를 바꾼 뒤에는 all 로 한꺼번에 다시 읽는다
export const categoryKeys = {
  all: ["category"] as const,
  adminTree: () => [...categoryKeys.all, "admin-tree"] as const,
};

export const useAdminCategoryTree = () => {
  return useQuery({
    queryKey: categoryKeys.adminTree(),
    queryFn: CategoryApi.adminTree,
  });
};
