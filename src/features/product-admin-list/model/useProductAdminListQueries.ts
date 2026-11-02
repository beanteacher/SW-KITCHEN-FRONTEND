"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys } from "@/entities/product";
import { ProductAdminListApi } from "../api/productAdminListApi";

// 성공해도 실패해도 목록을 다시 읽는다. 실패는 대개 그 사이 다른 담당자가 바꿨기 때문이다
export const useDeleteProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ProductAdminListApi.remove,
    onSettled: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
};
