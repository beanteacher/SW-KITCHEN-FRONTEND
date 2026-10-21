import { describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api";
import { applyServerFieldErrors, toFormFieldPath } from "./form-errors";

describe("서버 필드 오류를 폼에 붙이기", () => {
  it("배열 순번이 들어간 경로를 점 경로로 바꾼다", () => {
    expect(toFormFieldPath("options[1].discountValue")).toBe("options.1.discountValue");
    expect(toFormFieldPath("specs[0].items[12].value")).toBe("specs.0.items.12.value");
    expect(toFormFieldPath("name")).toBe("name");
  });

  it("오류마다 setError 를 부르고 첫 칸에만 포커스를 준다", () => {
    const setError = vi.fn();
    const fieldErrors = [
      { field: "name", message: "제품명을 입력해 주세요." },
      { field: "options[1].discountValue", message: "할인값이 너무 큽니다." },
    ];
    const error = new ApiError(400, "VALIDATION_ERROR", "입력값을 확인해 주세요.", fieldErrors);

    const count = applyServerFieldErrors(error, setError);

    expect(count).toBe(2);
    expect(setError).toHaveBeenNthCalledWith(
      1,
      "name",
      { type: "server", message: "제품명을 입력해 주세요." },
      { shouldFocus: true },
    );
    expect(setError).toHaveBeenNthCalledWith(
      2,
      "options.1.discountValue",
      { type: "server", message: "할인값이 너무 큽니다." },
      { shouldFocus: false },
    );
  });

  it("ApiError 가 아니거나 필드 오류가 없으면 아무것도 하지 않는다", () => {
    const setError = vi.fn();

    expect(applyServerFieldErrors(new Error("boom"), setError)).toBe(0);
    expect(
      applyServerFieldErrors(new ApiError(409, "CONCURRENT_MODIFICATION", "충돌"), setError),
    ).toBe(0);
    expect(setError).not.toHaveBeenCalled();
  });
});
