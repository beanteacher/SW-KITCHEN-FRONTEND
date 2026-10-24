"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryKeys, getAdminCategories } from "@/entities/category";
import {
  changeCategoryOrder,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../api/category-admin-api";
import type { UpdateCategoryRequest } from "./types";

export function useAdminCategories() {
  return useQuery({
    queryKey: categoryKeys.adminTree(),
    queryFn: getAdminCategories,
  });
}

// 성공해도 실패해도 목록을 다시 읽는다. 실패는 대개 그 사이 다른 담당자가 바꿨기 때문이다
// 다시 읽기를 기다린 뒤 끝나므로, 부른 쪽은 끝난 시점에 새 목록을 본다
function useCategoryMutation<T>(mutationFn: (variables: T) => Promise<unknown>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSettled: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  });
}

export function useCreateCategory() {
  return useCategoryMutation(createCategory);
}

export function useUpdateCategory() {
  return useCategoryMutation(({ id, request }: { id: number; request: UpdateCategoryRequest }) =>
    updateCategory(id, request),
  );
}

export function useChangeCategoryOrder() {
  return useCategoryMutation(changeCategoryOrder);
}

export function useDeleteCategory() {
  return useCategoryMutation(deleteCategory);
}
