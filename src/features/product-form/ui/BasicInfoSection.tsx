"use client";

import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useCategoryTree } from "@/entities/category";
import { MATERIAL_LABEL, MATERIALS, SALES_TYPE_LABEL, type ProductDto } from "@/entities/product";
import {
  AdminCheckbox,
  AdminFormField,
  AdminHint,
  AdminInput,
  AdminRadio,
  AdminSelect,
  AdminTable,
} from "@/shared/ui/admin";
import { PRODUCT_FIELD_CLASS } from "../config/fieldClass";
import { getSalesTypeLockReason, getSalesTypeNotice } from "../lib/salesTypeRules";
import type { ProductSchema } from "../model/schema/productSchema";
import SectionHeader from "./SectionHeader";

const SALES_TYPES: ProductDto.SalesType[] = ["NEW", "STOCK", "USED"];

interface Props {
  // 수정 화면에서 불러온 판매 구분과 예약 여부. 등록 화면은 null·false
  originalSalesType: ProductDto.SalesType | null;
  hasReserved: boolean;
}

// 제품명·분류·판매 구분·제조사·원산지·재질
export default function BasicInfoSection({ originalSalesType, hasReserved }: Props) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<ProductSchema.FormValues>();
  const name = useWatch({ control, name: "name" });
  const categoryId = useWatch({ control, name: "categoryId" });
  const salesType = useWatch({ control, name: "salesType" });
  const { data: tree = [] } = useCategoryTree();

  // 제품은 중분류에만 넣는다. 대분류만 고른 상태는 폼 값이 아니라 화면에만 둔다
  const parentOfCategory = tree.find((big) => big.children?.some((mid) => mid.id === categoryId));
  const [pickedBigId, setPickedBigId] = useState<number | null>(null);
  const bigId = pickedBigId ?? parentOfCategory?.id ?? null;
  const big = tree.find((item) => item.id === bigId);

  const isEdit = originalSalesType !== null;
  const lockReasons = SALES_TYPES.map((type) =>
    getSalesTypeLockReason(originalSalesType, type, hasReserved),
  );
  const notice = getSalesTypeNotice(originalSalesType, salesType);

  return (
    <section aria-label="기본 정보">
      <SectionHeader
        title="기본 정보"
        note={
          <>
            <span className="text-admin-error">*</span> 필수
          </>
        }
      />
      <AdminTable>
        <AdminFormField label="제품명" required error={errors.name?.message}>
          {(field) => (
            <div className="flex items-center">
              <AdminInput
                {...field}
                {...register("name")}
                maxLength={100}
                placeholder="제조사는 넣지 않습니다"
                className={`max-w-[520px] ${PRODUCT_FIELD_CLASS}`}
              />
              <span className="ml-1.5 shrink-0 text-xs text-admin-muted">{name.length}/100</span>
            </div>
          )}
        </AdminFormField>

        <AdminFormField
          label="분류"
          required
          error={errors.categoryId?.message}
          hint={isEdit && <AdminHint>분류를 바꿔도 이미 만든 상품 코드는 그대로입니다.</AdminHint>}
        >
          {(field) => (
            <div className="flex gap-1.5">
              <AdminSelect
                id={field.id}
                aria-label="대분류"
                aria-invalid={field["aria-invalid"] && !big}
                aria-describedby={field["aria-describedby"]}
                className="w-[200px]"
                placeholder="대분류 선택"
                value={bigId}
                options={tree.map((item) => ({ value: item.id, label: item.name ?? "" }))}
                onChange={(id) => {
                  if (id === bigId) return;
                  setPickedBigId(id);
                  // 대분류를 바꾸면 중분류는 다시 고른다
                  setValue("categoryId", null, { shouldDirty: true });
                }}
              />
              <AdminSelect
                aria-label="중분류"
                aria-invalid={field["aria-invalid"] && Boolean(big)}
                className="w-[200px]"
                placeholder="중분류 선택"
                disabled={!big}
                value={categoryId}
                options={(big?.children ?? []).map((item) => ({
                  value: item.id,
                  label: item.name ?? "",
                }))}
                onChange={(id) =>
                  setValue("categoryId", id, { shouldDirty: true, shouldValidate: true })
                }
              />
            </div>
          )}
        </AdminFormField>

        <AdminFormField
          label="판매 구분"
          required
          error={errors.salesType?.message}
          hint={
            <>
              {lockReasons
                .filter((reason, index) => reason && lockReasons.indexOf(reason) === index)
                .map((reason) => (
                  <AdminHint key={reason}>{reason}</AdminHint>
                ))}
              {notice && <AdminHint tone="info">{notice}</AdminHint>}
            </>
          }
        >
          {() => (
            <Controller
              control={control}
              name="salesType"
              render={({ field }) => (
                <div role="radiogroup" aria-label="판매 구분">
                  {SALES_TYPES.map((type, index) => (
                    <AdminRadio
                      key={type}
                      name={field.name}
                      label={SALES_TYPE_LABEL[type]}
                      checked={field.value === type}
                      disabled={Boolean(lockReasons[index])}
                      title={lockReasons[index] ?? undefined}
                      onChange={() => field.onChange(type)}
                    />
                  ))}
                </div>
              )}
            />
          )}
        </AdminFormField>

        <AdminFormField label="제조사" required error={errors.manufacturer?.message}>
          {(field) => (
            <AdminInput
              {...field}
              {...register("manufacturer")}
              maxLength={50}
              className={`w-[240px] ${PRODUCT_FIELD_CLASS}`}
            />
          )}
        </AdminFormField>

        <AdminFormField label="원산지" required error={errors.origin?.message}>
          {(field) => (
            <AdminInput
              {...field}
              {...register("origin")}
              maxLength={30}
              placeholder="예: 국산"
              className={`w-[240px] ${PRODUCT_FIELD_CLASS}`}
            />
          )}
        </AdminFormField>

        <AdminFormField label="재질">
          {() => (
            <Controller
              control={control}
              name="materials"
              render={({ field }) => (
                <div role="group" aria-label="재질">
                  {MATERIALS.map((material) => (
                    <AdminCheckbox
                      key={material}
                      label={MATERIAL_LABEL[material]}
                      checked={field.value.includes(material)}
                      onChange={(event) =>
                        field.onChange(
                          event.target.checked
                            ? MATERIALS.filter(
                                (item) => item === material || field.value.includes(item),
                              )
                            : field.value.filter((item) => item !== material),
                        )
                      }
                    />
                  ))}
                </div>
              )}
            />
          )}
        </AdminFormField>
      </AdminTable>
    </section>
  );
}
