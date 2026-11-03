"use client";

import { useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { toast } from "@/shared/lib";
import { AdminButton, AdminFieldError, AdminTable, AdminTh } from "@/shared/ui/admin";
import { emptyOption } from "../lib/productFormValues";
import type { ProductSchema } from "../model/schema/productSchema";
import DigitsInput from "./DigitsInput";
import OptionRow from "./OptionRow";
import SectionHeader from "./SectionHeader";

const MAX_OPTIONS = 99;

type BulkKey = "widthMm" | "depthMm" | "heightMm" | "listPrice" | "stockQty";

// "모든 옵션에 같은 값" 칸. 재고는 재고품·중고품만
const BULK_FIELDS: { key: BulkKey; label: string; unit: string; maxLength: number }[] = [
  { key: "widthMm", label: "가로", unit: "mm", maxLength: 5 },
  { key: "depthMm", label: "깊이", unit: "mm", maxLength: 5 },
  { key: "heightMm", label: "높이", unit: "mm", maxLength: 5 },
  { key: "listPrice", label: "정상가", unit: "원", maxLength: 11 },
  { key: "stockQty", label: "재고", unit: "개", maxLength: 5 },
];

const EMPTY_BULK: Record<BulkKey, string> = {
  widthMm: "",
  depthMm: "",
  heightMm: "",
  listPrice: "",
  stockQty: "",
};

interface Props {
  isEdit: boolean;
}

// 옵션(사이즈) 표. 한 줄이 한 사이즈. 위에 "모든 옵션에 같은 값", 아래 [+ 옵션 추가]
export default function OptionSection({ isEdit }: Props) {
  const {
    control,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<ProductSchema.FormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "options" });
  const salesType = useWatch({ control, name: "salesType" });
  const options = useWatch({ control, name: "options" });
  const [bulk, setBulk] = useState(EMPTY_BULK);
  // 추가 이미지를 펼친 줄 (useFieldArray 의 줄 key)
  const [openRows, setOpenRows] = useState<ReadonlySet<string>>(new Set());

  const countsStock = salesType === "STOCK" || salesType === "USED";
  const activeCount = options.filter((option) => !option.removed).length;
  const columnCount = 11 + Number(isEdit) + Number(countsStock);
  const bulkFields = BULK_FIELDS.filter((field) => field.key !== "stockQty" || countsStock);
  const optionsError = errors.options?.message ?? errors.options?.root?.message;

  const handleApply = () => {
    const filled = bulkFields.filter((field) => bulk[field.key]);
    if (filled.length === 0) {
      toast("넣을 값을 먼저 입력해 주세요.", "error");
      return;
    }
    let applied = 0;
    getValues("options").forEach((option, index) => {
      if (option.removed) return;
      applied += 1;
      for (const { key } of filled) {
        setValue(`options.${index}.${key}`, bulk[key], { shouldDirty: true });
        clearErrors(`options.${index}.${key}`);
      }
    });
    toast(`옵션 ${applied}개에 적용했습니다.`);
  };

  // 새 줄(저장 전)은 바로 빼고, 저장된 옵션은 표시만 해 두고 저장할 때 지운다
  const handleRemove = (index: number) => {
    if (getValues(`options.${index}.id`) === undefined) remove(index);
    else setValue(`options.${index}.removed`, true, { shouldDirty: true });
  };

  const toggleImages = (key: string) =>
    setOpenRows((prev) => {
      const next = new Set(prev);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  return (
    <section aria-label="옵션">
      <SectionHeader
        title="옵션 (사이즈)"
        required
        note={`사이즈마다 한 줄. ${
          isEdit
            ? "상품 코드는 자동으로 만든 것이라 고칠 수 없습니다"
            : "상품 코드는 등록하면 자동으로 만들어집니다"
        }`}
      />
      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2 border border-admin-line bg-admin-fill px-4 py-2.5">
        <b className="font-semibold">모든 옵션에 같은 값</b>
        {bulkFields.map(({ key, label, unit, maxLength }) => (
          <label key={key} className="inline-flex items-center gap-1 whitespace-nowrap">
            {label}
            <DigitsInput
              value={bulk[key]}
              onChange={(digits) => setBulk((prev) => ({ ...prev, [key]: digits }))}
              maxLength={maxLength}
              money={key === "listPrice"}
              className={key === "listPrice" ? "w-[100px]" : "w-16"}
            />
            {unit}
          </label>
        ))}
        <AdminButton size="compact" onClick={handleApply}>
          적용
        </AdminButton>
        <span className="text-xs text-admin-muted">채운 칸만 모든 옵션에 들어갑니다</span>
      </div>
      {/* 칸 너비는 고정이고, 본문이 좁으면 옵션 표만 가로로 스크롤된다 */}
      <AdminTable className="overflow-x-auto">
        <table className="w-full min-w-[1014px] table-fixed border-collapse leading-[18px]">
          <colgroup>
            <col className="w-9" />
            {isEdit && <col className="w-28" />}
            <col className="w-24" />
            <col className="w-[62px]" />
            <col className="w-[62px]" />
            <col className="w-[62px]" />
            <col className="w-24" />
            <col className="w-40" />
            <col className="w-[88px]" />
            {countsStock && <col className="w-[68px]" />}
            <col className="w-16" />
            <col className="w-[60px]" />
            <col className="w-12" />
          </colgroup>
          <thead>
            <tr>
              <AdminTh>번호</AdminTh>
              {isEdit && <AdminTh>상품 코드</AdminTh>}
              <AdminTh>제조사 모델명</AdminTh>
              <AdminTh>
                가로 mm<span className="text-admin-error">*</span>
              </AdminTh>
              <AdminTh>
                깊이 mm<span className="text-admin-error">*</span>
              </AdminTh>
              <AdminTh>
                높이 mm<span className="text-admin-error">*</span>
              </AdminTh>
              <AdminTh>
                정상가<span className="text-admin-error">*</span>
              </AdminTh>
              <AdminTh>할인</AdminTh>
              <AdminTh>판매가</AdminTh>
              {countsStock && (
                <AdminTh>
                  재고<span className="text-admin-error">*</span>
                </AdminTh>
              )}
              <AdminTh className="leading-[15px]">
                대표
                <br />
                이미지<span className="text-admin-error">*</span>
              </AdminTh>
              <AdminTh className="leading-[15px]">
                추가
                <br />
                이미지
              </AdminTh>
              <AdminTh>삭제</AdminTh>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <OptionRow
                key={field.id}
                index={index}
                isEdit={isEdit}
                countsStock={countsStock}
                columnCount={columnCount}
                imagesOpen={openRows.has(field.id)}
                onToggleImages={() => toggleImages(field.id)}
                onRemove={() => handleRemove(index)}
              />
            ))}
          </tbody>
        </table>
      </AdminTable>
      {optionsError && <AdminFieldError>{optionsError}</AdminFieldError>}
      <div className="mt-2 flex items-center gap-1.5">
        <AdminButton
          size="compact"
          variant="outline"
          disabled={activeCount >= MAX_OPTIONS}
          onClick={() => append(emptyOption(), { focusName: `options.${fields.length}.widthMm` })}
        >
          + 옵션 추가
        </AdminButton>
        <span className="text-xs text-admin-muted">
          {activeCount} / {MAX_OPTIONS}
        </span>
      </div>
    </section>
  );
}
