"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryKeys } from "@/entities/category";
import { productKeys } from "@/entities/product";
import { ProductAdminListApi } from "../api/productAdminListApi";

// 성공해도 실패해도 목록을 다시 읽는다. 실패는 대개 그 사이 다른 담당자가 바꿨기 때문이다
// 분류마다 붙는 제품 수도 바뀌므로 분류도 다시 읽는다 (분류 관리 옆 패널에서 지울 때)
export const useDeleteProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ProductAdminListApi.remove,
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: productKeys.all }),
        queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
      ]),
  });
};
