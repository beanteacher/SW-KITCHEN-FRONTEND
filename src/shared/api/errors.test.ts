import { HTTPError, NetworkError } from "ky";
import { describe, expect, it } from "vitest";
import { ApiError, toApiError } from "./errors";

function httpError(status: number, data: unknown) {
  const request = new Request("http://localhost/api/v1/product");
  const response = new Response(null, { status });
  const error = new HTTPError(response, request, {} as never);
  error.data = data;
  return error;
}

describe("API 오류 해석", () => {
  it("서버 오류 응답의 코드, 메시지, 필드 오류를 그대로 담는다", () => {
    const body = {
      success: false,
      code: "VALIDATION_ERROR",
      message: "입력값을 확인해 주세요.",
      errors: [{ field: "options[0].price", message: "가격을 입력해 주세요." }],
      timestamp: "2026-10-10T10:00:00+09:00",
    };
    const error = httpError(400, body);

    const result = toApiError(error);

    expect(result).toBeInstanceOf(ApiError);
    expect(result.status).toBe(400);
    expect(result.code).toBe("VALIDATION_ERROR");
    expect(result.message).toBe("입력값을 확인해 주세요.");
    expect(result.fieldErrors).toEqual([
      { field: "options[0].price", message: "가격을 입력해 주세요." },
    ]);
  });

  it("필드 오류가 없는 응답은 빈 목록으로 둔다", () => {
    const body = {
      success: false,
      code: "PRODUCT_NOT_FOUND",
      message: "제품을 찾을 수 없습니다.",
      timestamp: "",
    };
    const error = httpError(404, body);

    expect(toApiError(error).fieldErrors).toEqual([]);
  });

  it("본문이 오류 형식이 아니면 상태 코드는 지키고 기본 메시지를 쓴다", () => {
    const result = toApiError(httpError(502, "<html>Bad Gateway</html>"));

    expect(result.status).toBe(502);
    expect(result.code).toBe("UNKNOWN_ERROR");
    expect(result.message).not.toBe("");
  });

  it("서버에 닿지 못하면 네트워크 오류로 바꾼다", () => {
    const request = new Request("http://localhost/api/v1/product");
    const result = toApiError(new NetworkError(request, { cause: new TypeError("fetch failed") }));

    expect(result.status).toBe(0);
    expect(result.code).toBe("NETWORK_ERROR");
  });
});
