"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { formatNumber } from "@/shared/lib";
import { AdminFormField, AdminHint, AdminTable, AdminTextarea } from "@/shared/ui/admin";
import { PRODUCT_FIELD_CLASS } from "../config/fieldClass";
import type { ProductSchema } from "../model/schema/productSchema";
import SectionHeader from "./SectionHeader";

// 설명 글. 글자만 받고 줄바꿈은 고객 화면에 그대로 나온다
export default function DescriptionSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProductSchema.FormValues>();
  const description = useWatch({ control, name: "description" });

  return (
    <section aria-label="설명">
      <SectionHeader title="설명" note="글자만. 줄바꿈은 그대로 나옵니다" />
      <AdminTable>
        <AdminFormField
          label="설명 글"
          error={errors.description?.message}
          hint={<AdminHint>{formatNumber(description.length)} / 5,000자</AdminHint>}
        >
          {(field) => (
            <AdminTextarea
              {...field}
              {...register("description")}
              maxLength={5_000}
              className={`block h-[140px] resize-y leading-[1.6] ${PRODUCT_FIELD_CLASS}`}
            />
          )}
        </AdminFormField>
      </AdminTable>
    </section>
  );
}
