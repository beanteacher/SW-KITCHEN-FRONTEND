"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/shared/lib";
import { AdminFieldError } from "@/shared/ui/admin";
import { pickImageFiles } from "../lib/imageFiles";
import type { ProductSchema } from "../model/schema/productSchema";
import { useImageUpload } from "../model/useImageUpload";

interface Props {
  index: number;
  disabled: boolean;
}

// 옵션 대표 이미지 칸 (입력칸과 같은 32px). 비었으면 점선 +, 있으면 눌러서 바꾼다. 고르면 바로 올린다
export default function MainImageButton({ index, disabled }: Props) {
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<ProductSchema.FormValues>();
  const name = `options.${index}.mainImage` as const;
  const image = useWatch({ control, name });
  const { uploadAll } = useImageUpload();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const error = problem ?? errors.options?.[index]?.mainImage?.message;

  const handlePick = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = "";
    const picked = pickImageFiles(files, 1);
    setProblem(picked.problems[0] ?? null);
    if (picked.accepted.length === 0) return;

    setUploading(true);
    const uploaded = await uploadAll(picked.accepted);
    setUploading(false);
    const [first] = uploaded.images;
    if (!first) return setProblem(uploaded.problems[0] ?? null);
    setValue(name, first, { shouldDirty: true });
    clearErrors(name);
  };

  return (
    <>
      <button
        type="button"
        aria-label={`${index + 1}번 옵션 대표 이미지 ${image ? "바꾸기" : "올리기"}`}
        disabled={disabled || uploading}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "relative inline-flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-[2px] border border-dashed border-admin-border bg-[#fafbfc] p-0 text-[15px] text-admin-muted disabled:cursor-default",
          image && !uploading && "border-solid",
          error && "border-admin-error bg-[#fff8f8]",
        )}
      >
        {uploading ? (
          "…"
        ) : image ? (
          // 올린 이미지는 저장소 주소라 next/image 최적화를 거치지 않는다
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image.url} alt="" className="size-full object-cover" />
        ) : (
          "+"
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        onChange={handlePick}
      />
      {error && <AdminFieldError>{error}</AdminFieldError>}
    </>
  );
}
