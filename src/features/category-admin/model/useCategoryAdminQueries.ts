"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryKeys, type CategoryDto } from "@/entities/category";
import { CategoryAdminApi } from "../api/categoryAdminApi";

// 성공해도 실패해도 목록을 다시 읽는다. 실패는 대개 그 사이 다른 담당자가 바꿨기 때문이다
// 다시 읽기를 기다린 뒤 끝나므로, 부른 쪽은 끝난 시점에 새 목록을 본다
const useCategoryMutation = <T>(mutationFn: (variables: T) => Promise<unknown>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSettled: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  });
};

export const useCreateCategory = () => {
  return useCategoryMutation(CategoryAdminApi.create);
};

export const useEditCategory = () => {
  return useCategoryMutation(({ id, data }: { id: number; data: CategoryDto.EditForm }) =>
    CategoryAdminApi.edit(id, data),
  );
};

export const useChangeCategoryOrder = () => {
  return useCategoryMutation(CategoryAdminApi.changeOrder);
};

export const useDeleteCategory = () => {
  return useCategoryMutation(CategoryAdminApi.remove);
};
