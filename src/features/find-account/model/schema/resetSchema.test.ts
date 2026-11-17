import { describe, expect, it } from "vitest";
import { ResetSchema } from "./resetSchema";

describe("새 비밀번호 입력", () => {
  it("규칙에 맞고 확인이 같으면 받는다", () => {
    const result = ResetSchema.PasswordSchema.safeParse({
      newPassword: "abcd123!",
      newPasswordConfirm: "abcd123!",
    });
    expect(result.success).toBe(true);
  });

  it("특수문자가 없거나 확인이 다르면 그 칸에 오류를 붙인다", () => {
    const weak = ResetSchema.PasswordSchema.safeParse({
      newPassword: "abcd1234",
      newPasswordConfirm: "abcd1234",
    });
    const mismatch = ResetSchema.PasswordSchema.safeParse({
      newPassword: "abcd123!",
      newPasswordConfirm: "abcd123?",
    });

    expect(weak.error?.issues[0].path).toEqual(["newPassword"]);
    expect(mismatch.error?.issues[0].path).toEqual(["newPasswordConfirm"]);
  });
});
