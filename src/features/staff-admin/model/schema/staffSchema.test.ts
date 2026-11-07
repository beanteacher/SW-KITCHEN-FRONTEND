import { describe, expect, it } from "vitest";
import { StaffSchema } from "./staffSchema";

const valid = {
  userId: "staff02",
  name: "이담당",
  role: "STAFF",
  password: "1",
  passwordConfirm: "1",
};

describe("직원 추가 입력", () => {
  it("짧은 비밀번호도 받는다 (직원은 길이 규칙이 없다)", () => {
    expect(StaffSchema.CreateSchema.safeParse(valid).success).toBe(true);
  });

  it("아이디 형식이 틀리거나 비밀번호 확인이 다르면 그 칸에 오류를 붙인다", () => {
    const badId = StaffSchema.CreateSchema.safeParse({ ...valid, userId: "Staff" });
    const mismatch = StaffSchema.CreateSchema.safeParse({ ...valid, passwordConfirm: "2" });

    expect(badId.error?.issues[0].path).toEqual(["userId"]);
    expect(mismatch.error?.issues[0].path).toEqual(["passwordConfirm"]);
  });
});
