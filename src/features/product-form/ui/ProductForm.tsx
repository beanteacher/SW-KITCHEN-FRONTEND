"use client";

import Link from "next/link";
import { FormProvider } from "react-hook-form";
import type { ProductDto } from "@/entities/product";
import { AdminPageHeader, adminButtonClass } from "@/shared/ui/admin";
import { useProductFormActions } from "../model/useProductFormActions";
import BasicInfoSection from "./BasicInfoSection";
import DescriptionSection from "./DescriptionSection";
import SpecSection from "./SpecSection";

interface Props {
  // 있으면 수정 화면
  product?: ProductDto.AdminDetail;
}

// 제품 등록·수정: 위에서 아래로 기본 정보 · 상품 상세정보 · 옵션 · 이미지 · 설명
export default function ProductForm({ product }: Props) {
  const { form, isEdit, originalSalesType, hasReserved } = useProductFormActions(product);

  return (
    <FormProvider {...form}>
      <form noValidate>
        <AdminPageHeader
          title={isEdit ? "제품 수정" : "제품 등록"}
          sub={product ? `#${product.id}` : undefined}
          tight
          action={
            // ponytail: 관리 목록에서 고른 검색 조건은 아직 이어받지 않는다. 관리 목록 화면을 만들 때 붙인다
            <Link href="/admin/product" className={adminButtonClass({ variant: "outline" })}>
              목록으로
            </Link>
          }
        />
        <BasicInfoSection originalSalesType={originalSalesType} hasReserved={hasReserved} />
        <SpecSection />
        <DescriptionSection />
      </form>
    </FormProvider>
  );
}
