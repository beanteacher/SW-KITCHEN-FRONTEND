"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productKeys, type ProductDto } from "@/entities/product";
import { ProductFormApi } from "../api/productFormApi";

// 저장하면 제품 목록·상세를 다시 읽게 한다. 수정 화면은 응답으로 바로 다시 채우므로 기다리지 않는다
const useInvalidateProducts = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: productKeys.all });
};

export const useCreateProduct = () => {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: ProductFormApi.create,
    onSuccess: () => void invalidate(),
  });
};

export const useEditProduct = () => {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductDto.SaveForm }) =>
      ProductFormApi.edit(id, data),
    onSuccess: () => void invalidate(),
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: ProductFormApi.uploadImage,
  });
};
