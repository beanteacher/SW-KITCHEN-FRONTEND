import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/shared/api";

// 서버 필드 경로 "options[1].discountValue" → 폼 경로 "options.1.discountValue"
export function toFormFieldPath(serverField: string) {
  return serverField.replace(/\[(\d+)\]/g, ".$1");
}

// 서버가 돌려준 필드별 오류를 폼 입력칸에 붙이고 첫 칸으로 이동한다. 붙인 개수를 돌려준다
export function applyServerFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  if (!(error instanceof ApiError)) return 0;

  error.fieldErrors.forEach(({ field, message }, index) => {
    // ponytail: 서버 필드명이 폼 필드명과 같다고 믿고 그대로 쓴다. 다르면 매핑표를 넘겨받게 바꾼다
    const name = toFormFieldPath(field) as FieldPath<T>;
    setError(name, { type: "server", message }, { shouldFocus: index === 0 });
  });
  return error.fieldErrors.length;
}
