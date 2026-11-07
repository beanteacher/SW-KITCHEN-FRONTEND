import { describe, expect, it } from "vitest";
import { PasswordChangeSchema } from "./passwordChangeSchema";

const values = { currentPassword: "1234", newPassword: "1", newPasswordConfirm: "1" };

describe("비밀번호 변경 입력", () => {
  it("직원은 짧은 새 비밀번호도 받고, 고객은 규칙을 지켜야 한다", () => {
    expect(PasswordChangeSchema.StaffSchema.safeParse(values).success).toBe(true);
    expect(PasswordChangeSchema.CustomerSchema.safeParse(values).error?.issues[0].path).toEqual([
      "newPassword",
    ]);
  });

  it("새 비밀번호와 확인이 다르면 확인 칸에 오류를 붙인다", () => {
    const result = PasswordChangeSchema.StaffSchema.safeParse({
      ...values,
      newPasswordConfirm: "2",
    });

    expect(result.error?.issues[0].path).toEqual(["newPasswordConfirm"]);
  });
});
