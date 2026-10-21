import { isHTTPError, isKyError } from "ky";
import { z } from "zod";
import type { FieldError } from "./types";

const errorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  errors: z
    .array(
      z.object({
        field: z.string(),
        message: z.string(),
      }),
    )
    .optional(),
});

const FALLBACK_MESSAGE = "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
const NETWORK_MESSAGE = "서버에 연결하지 못했습니다. 네트워크 상태를 확인해 주세요.";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors: FieldError[];

  constructor(status: number, code: string, message: string, fieldErrors: FieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

// 어떤 에러가 와도 화면에서 쓰기 쉬운 ApiError 하나로 바꾼다
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (isHTTPError(error)) {
    const status = error.response.status;
    const parsed = errorResponseSchema.safeParse(error.data);
    if (!parsed.success) {
      return new ApiError(status, "UNKNOWN_ERROR", FALLBACK_MESSAGE);
    }
    const { code, message, errors } = parsed.data;
    return new ApiError(status, code, message, errors);
  }

  if (isKyError(error)) {
    return new ApiError(0, "NETWORK_ERROR", NETWORK_MESSAGE);
  }

  // fetch 자체가 실패하면 TypeError 가 올라온다
  if (error instanceof TypeError) {
    return new ApiError(0, "NETWORK_ERROR", NETWORK_MESSAGE);
  }

  return new ApiError(0, "UNKNOWN_ERROR", FALLBACK_MESSAGE);
}
