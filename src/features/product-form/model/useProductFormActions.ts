"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ProductDto } from "@/entities/product";
import { toFormValues } from "../lib/productFormValues";
import { ProductSchema } from "./schema/productSchema";

// 제품 등록·수정 화면의 폼과 상태. product 가 있으면 수정 화면이다
export function useProductFormActions(product?: ProductDto.AdminDetail) {
  const form = useForm<ProductSchema.FormValues>({
    resolver: zodResolver(ProductSchema.ProductFormSchema),
    defaultValues: toFormValues(product),
  });

  const isEdit = product !== undefined;
  // 판매 구분을 잠글지 보는 데 쓴다. 등록 화면은 셋 다 고를 수 있다
  const originalSalesType = product?.salesType ?? null;
  const hasReserved = (product?.options ?? []).some((option) => (option.reservedQty ?? 0) > 0);

  return { form, isEdit, originalSalesType, hasReserved };
}
