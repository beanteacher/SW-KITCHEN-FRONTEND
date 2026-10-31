"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { get, useFieldArray, useFormContext } from "react-hook-form";
import { AdminButton, AdminFieldError, AdminHint } from "@/shared/ui/admin";
import { pickImageFiles } from "../lib/imageFiles";
import type { ProductSchema } from "../model/schema/productSchema";
import { useImageUpload } from "../model/useImageUpload";

type StripName = "images" | "detailImages" | `options.${number}.images`;

interface Props {
  name: StripName;
  max: number;
  label: string;
}

// 여러 장 이미지 띠: 96px 썸네일에 번호, ← → 로 순서, × 로 빼기, 끝에 [+ 추가]. 고르면 바로 올린다
export default function ImageStrip({ name, max, label }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProductSchema.FormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name });
  const { uploadAll } = useImageUpload();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(0);
  const [problems, setProblems] = useState<string[]>([]);
  // 장수 한도는 배열 자체 오류라 root 에 붙기도 한다
  const fieldError: string | undefined =
    get(errors, `${name}.message`) ?? get(errors, `${name}.root.message`);

  const handlePick = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = "";
    const picked = pickImageFiles(files, max - fields.length - pending);
    setProblems(picked.problems);
    if (picked.accepted.length === 0) return;

    setPending((count) => count + picked.accepted.length);
    const uploaded = await uploadAll(picked.accepted);
    setPending((count) => count - picked.accepted.length);
    if (uploaded.images.length > 0) append(uploaded.images);
    if (uploaded.problems.length > 0) setProblems((prev) => [...prev, ...uploaded.problems]);
  };

  return (
    <div role="group" aria-label={label}>
      <div className="flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <figure key={field.id} className="relative m-0 w-24">
            {/* 올린 이미지는 저장소 주소라 next/image 최적화를 거치지 않는다 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={field.url}
              alt={`${label} ${index + 1}번째`}
              className="block size-24 rounded-[2px] border border-admin-line bg-[#fafbfc] object-cover"
            />
            <b className="absolute top-0 left-0 h-5 min-w-5 bg-ink/80 px-1 text-center text-[11px] leading-5 text-white">
              {index + 1}
            </b>
            <figcaption className="mt-1 flex justify-center gap-0.5">
              <AdminButton
                size="icon"
                variant="outline"
                className="h-[22px] w-[30px]"
                aria-label={`${index + 1}번째 이미지 앞으로`}
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
              >
                ←
              </AdminButton>
              <AdminButton
                size="icon"
                variant="outline"
                className="h-[22px] w-[30px]"
                aria-label={`${index + 1}번째 이미지 뒤로`}
                disabled={index === fields.length - 1}
                onClick={() => move(index, index + 1)}
              >
                →
              </AdminButton>
              <AdminButton
                size="icon"
                variant="outline"
                className="h-[22px] w-[30px]"
                aria-label={`${index + 1}번째 이미지 빼기`}
                onClick={() => remove(index)}
              >
                ×
              </AdminButton>
            </figcaption>
          </figure>
        ))}
        {Array.from({ length: pending }, (_, index) => (
          <div
            key={`pending-${index}`}
            className="flex size-24 items-center justify-center rounded-[2px] border border-admin-line bg-[#fafbfc] text-xs text-admin-muted"
          >
            올리는 중…
          </div>
        ))}
        <button
          type="button"
          disabled={fields.length + pending >= max}
          onClick={() => fileRef.current?.click()}
          className="flex size-24 cursor-pointer flex-col items-center justify-center rounded-[2px] border border-dashed border-admin-border bg-[#fafbfc] text-xs text-[#555] disabled:cursor-default disabled:text-[#ccc]"
        >
          <span className="text-[22px] leading-none">+</span>
          추가
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={handlePick}
        />
      </div>
      <AdminHint>
        {fields.length} / {max}장 · JPG·PNG·WEBP, 한 장 10MB 이하
      </AdminHint>
      {problems.length > 0 && <AdminFieldError>{problems.join(" ")}</AdminFieldError>}
      {fieldError && <AdminFieldError>{fieldError}</AdminFieldError>}
    </div>
  );
}
