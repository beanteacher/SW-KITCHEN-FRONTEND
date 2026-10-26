"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { KeyboardEvent, ReactNode } from "react";
import { useForm } from "react-hook-form";
import type { CategoryDto } from "@/entities/category";
import { toApiError } from "@/shared/api";
import { cn, toast } from "@/shared/lib";
import { Button, FieldError, Input } from "@/shared/ui";
import { getDuplicateAbbrMessage, getServerFieldErrors, normalizeAbbr } from "../lib/categoryRules";
import { CategorySchema } from "../model/schema/categorySchema";
import Td from "./Td";

interface Props {
  siblings: CategoryDto.AdminTree[];
  // 있으면 수정, 없으면 맨 아래 추가 줄
  editing?: { category: CategoryDto.AdminTree; abbrLocked: boolean };
  order: ReactNode;
  productCount?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onSubmit: (values: CategorySchema.CreateFormValues) => Promise<void>;
  onCancel?: () => void;
}

// 이름·약어를 치는 한 줄. 추가 줄과 수정 중인 줄이 같이 쓴다
export default function CategoryInputRow({
  siblings,
  editing,
  order,
  productCount,
  selected = false,
  disabled = false,
  onSubmit,
  onCancel,
}: Props) {
  const abbrLocked = editing?.abbrLocked ?? false;
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategorySchema.CreateFormValues>({
    resolver: zodResolver(CategorySchema.getFormSchema(abbrLocked)),
    defaultValues: { name: editing?.category.name ?? "", abbr: editing?.category.abbr ?? "" },
  });

  const submit = handleSubmit(async (values) => {
    // 형제끼리 약어가 겹치는지는 목록을 봐야 알아서 스키마 밖에서 본다
    const duplicate = abbrLocked
      ? null
      : getDuplicateAbbrMessage(siblings, values.abbr, editing?.category.id);
    if (duplicate) {
      setError("abbr", { message: duplicate }, { shouldFocus: true });
      return;
    }

    try {
      await onSubmit(values);
      // 추가 줄은 다음 분류를 바로 칠 수 있게 비운다. 입력은 실패했을 때만 남긴다
      if (!editing) reset();
    } catch (error) {
      const fieldErrors = getServerFieldErrors(error);
      if (!fieldErrors) {
        toast(toApiError(error).message, "error");
        return;
      }
      if (fieldErrors.name) setError("name", { message: fieldErrors.name }, { shouldFocus: true });
      if (fieldErrors.abbr) {
        setError("abbr", { message: fieldErrors.abbr }, { shouldFocus: !fieldErrors.name });
      }
    }
  });

  // 한글을 치는 중에 누른 Enter 는 글자를 마무리할 뿐이라 보내지 않는다
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (!disabled && !isSubmitting) void submit();
  };

  const busy = disabled || isSubmitting;
  const abbrField = register("abbr");

  return (
    <tr className={cn(editing ? selected && "bg-picked" : "bg-row-hover")}>
      <Td>{order}</Td>
      <Td className="text-left">
        <Input
          {...register("name")}
          maxLength={20}
          placeholder="이름 (20자 이하)"
          aria-label="이름"
          aria-invalid={Boolean(errors.name)}
          className="h-7"
          onKeyDown={handleKeyDown}
        />
        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </Td>
      <Td>
        <Input
          {...abbrField}
          maxLength={2}
          placeholder="AA"
          aria-label="약어"
          aria-invalid={Boolean(errors.abbr)}
          disabled={abbrLocked}
          title={
            abbrLocked
              ? `제품 ${editing?.category.productCount}개가 연결되어 약어를 바꿀 수 없습니다 (상품 코드가 바뀌면 안 됨)`
              : undefined
          }
          className="h-7 text-center font-mono"
          // 치는 대로 대문자로 바꾸고 영문 외 글자는 지운다
          onChange={(event) => {
            event.target.value = normalizeAbbr(event.target.value);
            void abbrField.onChange(event);
          }}
          onKeyDown={handleKeyDown}
        />
        {errors.abbr && <FieldError>{errors.abbr.message}</FieldError>}
        {abbrLocked && (
          <p className="mt-1 text-left text-[11px] text-gray-400">제품 있음 · 못 바꿈</p>
        )}
      </Td>
      <Td className="text-right tabular-nums">{productCount}</Td>
      <Td className="whitespace-nowrap">
        {editing ? (
          <>
            <Button size="xs" disabled={busy} onClick={() => void submit()}>
              저장
            </Button>
            <Button size="xs" variant="outline" className="ml-1" onClick={onCancel}>
              취소
            </Button>
          </>
        ) : (
          <Button size="xs" disabled={busy} onClick={() => void submit()}>
            추가
          </Button>
        )}
      </Td>
    </tr>
  );
}
