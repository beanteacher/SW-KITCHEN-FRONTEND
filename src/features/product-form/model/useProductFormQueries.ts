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

// 올리는 중인 이미지가 있는지 [저장] 줄에서 useIsMutating 으로 센다
export const UPLOAD_IMAGE_KEY = ["product-image-upload"];

export const useUploadImage = () => {
  return useMutation({
    mutationKey: UPLOAD_IMAGE_KEY,
    mutationFn: ProductFormApi.uploadImage,
  });
};
