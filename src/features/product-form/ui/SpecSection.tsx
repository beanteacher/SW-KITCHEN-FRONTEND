"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import {
  AdminButton,
  AdminFieldError,
  AdminInput,
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/shared/ui/admin";
import { PRODUCT_FIELD_CLASS } from "../config/fieldClass";
import type { ProductSchema } from "../model/schema/productSchema";
import SectionHeader from "./SectionHeader";

const MAX_SPECS = 30;

// 상품 상세정보(항목·내용) 줄. 순서는 ↑↓ 로 바꾸고 × 로 뺀다
export default function SpecSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProductSchema.FormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "specs" });

  return (
    <section aria-label="상품 상세정보">
      <SectionHeader
        title="상품 상세정보"
        note='고객 상세의 "상품 상세정보" 표에서 고정 항목(제품명·제조사·상품 코드·원산지·사이즈·재질) 아래 이 순서대로 나옵니다'
      />
      <AdminTable>
        <table className="w-full table-fixed border-collapse leading-[18px]">
          <colgroup>
            <col className="w-[72px]" />
            <col className="w-[220px]" />
            <col />
            <col className="w-[60px]" />
          </colgroup>
          <thead>
            <tr>
              <AdminTh>순서</AdminTh>
              <AdminTh>항목</AdminTh>
              <AdminTh>내용</AdminTh>
              <AdminTh>빼기</AdminTh>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 && (
              <tr>
                <AdminTd colSpan={4} className="p-4 text-faint">
                  추가한 항목이 없습니다.
                </AdminTd>
              </tr>
            )}
            {fields.map((field, index) => {
              const error = errors.specs?.[index];
              return (
                <tr key={field.id}>
                  <AdminTd className="p-1.5">
                    <div className="flex justify-center gap-1">
                      <AdminButton
                        size="icon"
                        variant="outline"
                        aria-label={`${index + 1}번 항목 위로`}
                        disabled={index === 0}
                        onClick={() => move(index, index - 1)}
                      >
                        ↑
                      </AdminButton>
                      <AdminButton
                        size="icon"
                        variant="outline"
                        aria-label={`${index + 1}번 항목 아래로`}
                        disabled={index === fields.length - 1}
                        onClick={() => move(index, index + 1)}
                      >
                        ↓
                      </AdminButton>
                    </div>
                  </AdminTd>
                  <AdminTd className="p-1.5 text-left align-top">
                    <AdminInput
                      {...register(`specs.${index}.name`)}
                      aria-label={`${index + 1}번 항목`}
                      aria-invalid={Boolean(error?.name)}
                      maxLength={30}
                      placeholder="예: 소비전력"
                      className={PRODUCT_FIELD_CLASS}
                    />
                    {error?.name && <AdminFieldError>{error.name.message}</AdminFieldError>}
                  </AdminTd>
                  <AdminTd className="p-1.5 text-left align-top">
                    <AdminInput
                      {...register(`specs.${index}.value`)}
                      aria-label={`${index + 1}번 내용`}
                      aria-invalid={Boolean(error?.value)}
                      maxLength={100}
                      placeholder="예: 1300W"
                      className={PRODUCT_FIELD_CLASS}
                    />
                    {error?.value && <AdminFieldError>{error.value.message}</AdminFieldError>}
                  </AdminTd>
                  <AdminTd className="p-1.5">
                    <AdminButton
                      size="icon"
                      variant="outline"
                      aria-label={`${index + 1}번 항목 빼기`}
                      onClick={() => remove(index)}
                    >
                      ×
                    </AdminButton>
                  </AdminTd>
                </tr>
              );
            })}
          </tbody>
        </table>
      </AdminTable>
      <div className="mt-2 flex items-center gap-1.5">
        <AdminButton
          size="compact"
          variant="outline"
          disabled={fields.length >= MAX_SPECS}
          onClick={() => append({ name: "", value: "" })}
        >
          + 항목 추가
        </AdminButton>
        <span className="text-xs text-admin-muted">
          {fields.length} / {MAX_SPECS}
        </span>
      </div>
    </section>
  );
}
