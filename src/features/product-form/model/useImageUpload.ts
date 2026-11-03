"use client";

import type { ProductDto } from "@/entities/product";
import { toApiError } from "@/shared/api";
import { useUploadImage } from "./useProductFormQueries";

// 고른 파일을 한꺼번에 올린다. 받은 이미지는 고른 순서대로, 서버가 거부한 파일은 이유를 돌려준다
export function useImageUpload() {
  const { mutateAsync } = useUploadImage();

  const uploadAll = async (files: File[]) => {
    const results = await Promise.allSettled(files.map((file) => mutateAsync(file)));
    const images: ProductDto.Image[] = [];
    const problems: string[] = [];
    results.forEach((result, index) => {
      if (result.status === "fulfilled") images.push(result.value);
      else problems.push(`${files[index].name}: ${toApiError(result.reason).message}`);
    });
    return { images, problems };
  };

  return { uploadAll };
}
