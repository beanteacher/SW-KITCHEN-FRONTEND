"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { AdminCategory } from "@/entities/category";
import { toApiError } from "@/shared/api";
import { cn, toast } from "@/shared/lib";
import { Button, FieldError, Input } from "@/shared/ui";
import {
  getServerFieldErrors,
  normalizeAbbr,
  validateCategory,
  type CategoryFieldErrors,
} from "../lib/category-rules";
import type { CategoryFormValues } from "../model/category-schema";
import { Td } from "./table-cell";

interface CategoryInputRowProps {
  siblings: AdminCategory[];
  // 있으면 수정, 없으면 맨 아래 추가 줄
  editing?: { category: AdminCategory; abbrLocked: boolean };
  order: ReactNode;
  productCount?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  onCancel?: () => void;
}

// 이름·약어를 치는 한 줄. 추가 줄과 수정 중인 줄이 같이 쓴다
export function CategoryInputRow({
  siblings,
  editing,
  order,
  productCount,
  selected = false,
  disabled = false,
  onSubmit,
  onCancel,
}: CategoryInputRowProps) {
  const [name, setName] = useState(editing?.category.name ?? "");
  const [abbr, setAbbr] = useState(editing?.category.abbr ?? "");
  const [errors, setErrors] = useState<CategoryFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const abbrRef = useRef<HTMLInputElement>(null);

  const abbrLocked = editing?.abbrLocked ?? false;

  const showErrors = (found: CategoryFieldErrors) => {
    setErrors(found);
    if (found.name) nameRef.current?.focus();
    else if (found.abbr) abbrRef.current?.focus();
  };

  const submit = async () => {
    const found = validateCategory({ name, abbr }, siblings, {
      selfId: editing?.category.id,
      abbrLocked,
    });
    if (found.name || found.abbr) return showErrors(found);

    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), abbr });
      // 추가 줄은 다음 분류를 바로 칠 수 있게 비운다. 입력은 실패했을 때만 남긴다
      if (!editing) {
        setName("");
        setAbbr("");
      }
    } catch (error) {
      const fieldErrors = getServerFieldErrors(error);
      if (fieldErrors) showErrors(fieldErrors);
      else toast(toApiError(error).message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 한글을 치는 중에 누른 Enter 는 글자를 마무리할 뿐이라 보내지 않는다
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (!disabled && !isSubmitting) void submit();
  };

  const busy = disabled || isSubmitting;

  return (
    <tr className={cn(editing ? selected && "bg-picked" : "bg-row-hover")}>
      <Td>{order}</Td>
      <Td className="text-left">
        <Input
          ref={nameRef}
          value={name}
          maxLength={20}
          placeholder="이름 (20자 이하)"
          aria-label="이름"
          aria-invalid={Boolean(errors.name)}
          className="h-7"
          onChange={(event) => {
            setName(event.target.value);
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          onKeyDown={handleKeyDown}
        />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </Td>
      <Td>
        <Input
          ref={abbrRef}
          value={abbr}
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
          onChange={(event) => {
            setAbbr(normalizeAbbr(event.target.value));
            setErrors((prev) => ({ ...prev, abbr: undefined }));
          }}
          onKeyDown={handleKeyDown}
        />
        {errors.abbr && <FieldError>{errors.abbr}</FieldError>}
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
