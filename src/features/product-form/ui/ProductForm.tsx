"use client";

import { FormProvider } from "react-hook-form";
import type { ProductDto } from "@/entities/product";
import { AlertDialog } from "@/shared/ui";
import { AdminButton, AdminPageHeader } from "@/shared/ui/admin";
import { useProductFormActions } from "../model/useProductFormActions";
import BasicInfoSection from "./BasicInfoSection";
import DescriptionSection from "./DescriptionSection";
import ImageSection from "./ImageSection";
import OptionSection from "./OptionSection";
import SpecSection from "./SpecSection";

interface Props {
  // 있으면 수정 화면
  product?: ProductDto.AdminDetail;
}

// 제품 등록·수정: 위에서 아래로 기본 정보 · 상품 상세정보 · 옵션 · 이미지 · 설명, 맨 아래 [취소] [저장] 줄
export default function ProductForm({ product: initialProduct }: Props) {
  const {
    form,
    formKey,
    product,
    isEdit,
    originalSalesType,
    hasReserved,
    alert,
    savedOpen,
    errorCount,
    isUploading,
    isSaving,
    handleSave,
    handleReload,
    handleLeave,
    handleCloseSaved,
  } = useProductFormActions(initialProduct);

  return (
    <FormProvider {...form}>
      {/* 저장은 [저장] 버튼으로만 한다. 제출 버튼이 없어 입력칸에서 Enter 를 쳐도 저장되지 않는다 */}
      <form noValidate>
        <AdminPageHeader
          title={isEdit ? "제품 수정" : "제품 등록"}
          sub={product ? `#${product.id}` : undefined}
          tight
          action={
            <AdminButton variant="outline" onClick={handleLeave}>
              목록으로
            </AdminButton>
          }
        />
        {alert && (
          <div
            role="alert"
            className="mt-4 border border-[#f3b4b5] bg-[#fff5f5] px-4 py-3 leading-[1.6] text-[#b42318]"
          >
            {alert.message}
            {alert.reload && (
              <AdminButton size="compact" variant="outline" className="ml-2" onClick={handleReload}>
                다시 불러오기
              </AdminButton>
            )}
          </div>
        )}
        <div key={formKey}>
          <BasicInfoSection originalSalesType={originalSalesType} hasReserved={hasReserved} />
          <SpecSection />
          <OptionSection isEdit={isEdit} />
          <ImageSection />
          <DescriptionSection />
        </div>
        <div className="sticky bottom-0 z-[5] -mx-6 mt-7 -mb-[60px] flex items-center justify-center gap-1.5 border-t border-admin-line bg-white px-6 py-3">
          {errorCount > 0 ? (
            <span className="absolute left-6 text-admin-error">
              입력값을 확인해 주세요 ({errorCount}곳)
            </span>
          ) : (
            isUploading && (
              <span className="absolute left-6 text-admin-muted">이미지를 올리는 중…</span>
            )
          )}
          <AdminButton variant="outline" className="h-9 min-w-[90px]" onClick={handleLeave}>
            취소
          </AdminButton>
          <AdminButton
            className="h-9 min-w-[90px]"
            disabled={isUploading || isSaving}
            onClick={handleSave}
          >
            {isEdit ? "저장" : "등록"}
          </AdminButton>
        </div>
      </form>
      <AlertDialog open={savedOpen} kind="success" title="저장 완료" onClose={handleCloseSaved}>
        저장되었습니다.
      </AlertDialog>
    </FormProvider>
  );
}
