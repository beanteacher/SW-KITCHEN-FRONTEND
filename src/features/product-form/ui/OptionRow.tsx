"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { calcSalePrice, type ProductDto } from "@/entities/product";
import { cn, formatPrice } from "@/shared/lib";
import { AdminButton, AdminFieldError, AdminInput, AdminTd } from "@/shared/ui/admin";
import { PRODUCT_FIELD_CLASS } from "../config/fieldClass";
import type { ProductSchema } from "../model/schema/productSchema";
import DigitsInput from "./DigitsInput";
import ImageStrip from "./ImageStrip";
import MainImageButton from "./MainImageButton";

const MAX_OPTION_IMAGES = 10;

const DISCOUNT_TYPES: { value: ProductDto.DiscountType; label: string }[] = [
  { value: "NONE", label: "없음" },
  { value: "RATE", label: "%" },
  { value: "AMOUNT", label: "원" },
];

// 치수 칸 셋
const SIZE_FIELDS = [
  { key: "widthMm", label: "가로" },
  { key: "depthMm", label: "깊이" },
  { key: "heightMm", label: "높이" },
] as const;

interface Props {
  index: number;
  isEdit: boolean;
  countsStock: boolean;
  columnCount: number;
  imagesOpen: boolean;
  onToggleImages: () => void;
  onRemove: () => void;
}

// 옵션 표 한 줄 (+ 펼치면 그 아래 추가 이미지 줄). 지울 옵션은 흐리게 두고 [↺] 로 되돌린다
export default function OptionRow({
  index,
  isEdit,
  countsStock,
  columnCount,
  imagesOpen,
  onToggleImages,
  onRemove,
}: Props) {
  const {
    register,
    control,
    setValue,
    setFocus,
    clearErrors,
    formState: { errors },
  } = useFormContext<ProductSchema.FormValues>();
  const option = useWatch({ control, name: `options.${index}` });
  const error = errors.options?.[index];
  const path = <K extends keyof ProductSchema.OptionValues>(key: K) =>
    `options.${index}.${key}` as const;

  const removed = option.removed;
  const salePrice = calcSalePrice(
    option.listPrice ? Number(option.listPrice) : null,
    option.discountType,
    option.discountValue ? Number(option.discountValue) : null,
  );

  // 할인 종류를 바꾸면 값은 비우고, 값을 넣는 종류면 값 칸으로 간다
  const handleDiscountType = (type: ProductDto.DiscountType) => {
    if (type === option.discountType) return;
    setValue(path("discountType"), type, { shouldDirty: true });
    setValue(path("discountValue"), "", { shouldDirty: true });
    clearErrors(path("discountValue"));
    // 잠겨 있던 값 칸이 풀린 뒤에 옮긴다
    if (type !== "NONE") setTimeout(() => setFocus(path("discountValue")));
  };

  const cellClass = cn(
    "p-1.5 align-top",
    removed && "bg-[#f7f7f7] text-[#aaa]",
    !removed && error && "bg-[#fff8f8]",
  );

  // 숫자 칸 하나 (치수·정상가·재고)
  const digitsCell = (
    key: "widthMm" | "depthMm" | "heightMm" | "listPrice" | "stockQty",
    label: string,
    maxLength: number,
  ) => (
    <AdminTd key={key} className={cellClass}>
      <Controller
        control={control}
        name={path(key)}
        render={({ field, fieldState }) => (
          <DigitsInput
            {...field}
            aria-label={`${index + 1}번 ${label}`}
            aria-invalid={Boolean(fieldState.error)}
            maxLength={maxLength}
            money={key === "listPrice"}
            disabled={removed}
          />
        )}
      />
      {error?.[key] && <AdminFieldError>{error[key].message}</AdminFieldError>}
      {key === "stockQty" && option.reservedQty > 0 && (
        <span
          title="주문·견적에 묶인 수량. 재고는 이보다 작게 못 바꿉니다"
          className="mt-0.5 block text-[11px] whitespace-nowrap text-[#b26200]"
        >
          예약 {option.reservedQty}
        </span>
      )}
    </AdminTd>
  );

  return (
    <>
      <tr>
        <AdminTd className={cn(cellClass, "align-middle")}>{index + 1}</AdminTd>
        {isEdit && (
          <AdminTd className={cellClass}>
            {option.productCode ? (
              <>
                <span
                  className={cn(
                    "font-mono text-xs leading-8 whitespace-nowrap",
                    removed && "line-through",
                  )}
                >
                  {option.productCode}
                </span>
                {removed && (
                  <span className="block text-[11px] whitespace-nowrap text-admin-error">
                    저장하면 삭제
                  </span>
                )}
              </>
            ) : (
              <span className="leading-8 text-faint">저장 때 발급</span>
            )}
          </AdminTd>
        )}
        <AdminTd className={cellClass}>
          <AdminInput
            {...register(path("modelName"))}
            aria-label={`${index + 1}번 제조사 모델명`}
            aria-invalid={Boolean(error?.modelName)}
            maxLength={50}
            disabled={removed}
            className={PRODUCT_FIELD_CLASS}
          />
          {error?.modelName && <AdminFieldError>{error.modelName.message}</AdminFieldError>}
        </AdminTd>
        {SIZE_FIELDS.map(({ key, label }) => digitsCell(key, `${label} mm`, 5))}
        {digitsCell("listPrice", "정상가", 11)}
        <AdminTd className={cellClass}>
          <div className="grid grid-cols-[1fr_78px] gap-1">
            <Controller
              control={control}
              name={path("discountValue")}
              render={({ field, fieldState }) => (
                <DigitsInput
                  {...field}
                  aria-label={`${index + 1}번 할인 값`}
                  aria-invalid={Boolean(fieldState.error)}
                  maxLength={option.discountType === "RATE" ? 2 : 11}
                  money={option.discountType === "AMOUNT"}
                  disabled={removed || option.discountType === "NONE"}
                />
              )}
            />
            <div role="group" aria-label={`${index + 1}번 할인 종류`} className="flex">
              {DISCOUNT_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={option.discountType === value}
                  disabled={removed}
                  onClick={() => handleDiscountType(value)}
                  className="h-8 flex-1 cursor-pointer border border-l-0 border-admin-border bg-white p-0 text-xs text-[#555] first:rounded-l-[2px] first:border-l last:rounded-r-[2px] disabled:cursor-default aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:font-semibold aria-pressed:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {error?.discountValue && <AdminFieldError>{error.discountValue.message}</AdminFieldError>}
        </AdminTd>
        <AdminTd className={cellClass}>
          <span
            className={cn(
              "leading-8 whitespace-nowrap",
              salePrice === null ? "text-admin-error" : "font-semibold",
            )}
          >
            {salePrice === null ? "—" : formatPrice(salePrice)}
          </span>
        </AdminTd>
        {countsStock && digitsCell("stockQty", "재고", 5)}
        <AdminTd className={cellClass}>
          <MainImageButton index={index} disabled={removed} />
        </AdminTd>
        <AdminTd className={cn(cellClass, "align-middle")}>
          <AdminButton
            size="compact"
            variant="outline"
            aria-expanded={imagesOpen}
            disabled={removed}
            onClick={onToggleImages}
          >
            {option.images.length}장 {imagesOpen ? "▴" : "▾"}
          </AdminButton>
        </AdminTd>
        <AdminTd className={cn(cellClass, "align-middle")}>
          {removed ? (
            <AdminButton
              size="icon"
              variant="outline"
              aria-label={`${index + 1}번 옵션 삭제 되돌리기`}
              title="삭제 되돌리기"
              onClick={() => setValue(path("removed"), false, { shouldDirty: true })}
            >
              ↺
            </AdminButton>
          ) : (
            <AdminButton
              size="icon"
              variant="outline"
              aria-label={`${index + 1}번 옵션 삭제`}
              disabled={option.reservedQty > 0}
              title={
                option.reservedQty > 0
                  ? `예약 ${option.reservedQty}개가 있어 삭제할 수 없습니다`
                  : undefined
              }
              onClick={onRemove}
            >
              ×
            </AdminButton>
          )}
        </AdminTd>
      </tr>
      {imagesOpen && !removed && (
        <tr>
          <AdminTd colSpan={columnCount} className="bg-[#fafbfc] p-3 text-left">
            <p className="mb-2">
              <b className="font-semibold">{index + 1}번 옵션 추가 이미지</b> — 고객 상세에서 이
              옵션을 고르면 대표 이미지 다음에 나옵니다
            </p>
            <ImageStrip
              key={path("images")}
              name={path("images")}
              max={MAX_OPTION_IMAGES}
              label={`${index + 1}번 옵션 추가 이미지`}
            />
          </AdminTd>
        </tr>
      )}
    </>
  );
}
