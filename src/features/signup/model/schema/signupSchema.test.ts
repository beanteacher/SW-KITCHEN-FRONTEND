import { describe, expect, it } from "vitest";
import { SignupSchema } from "./signupSchema";

const valid = { userId: "kitchen01", password: "abcd123!", passwordConfirm: "abcd123!" };

describe("아이디·비밀번호 입력", () => {
  it("규칙에 맞으면 받는다", () => {
    expect(SignupSchema.AccountSchema.safeParse(valid).success).toBe(true);
  });

  it("대문자 아이디, 특수문자 없는 비밀번호, 다른 확인 값은 그 칸에 오류를 붙인다", () => {
    const paths = (values: typeof valid) =>
      SignupSchema.AccountSchema.safeParse(values).error?.issues.map((issue) => issue.path[0]);

    expect(paths({ ...valid, userId: "Kitchen1" })).toEqual(["userId"]);
    expect(paths({ ...valid, password: "abcd1234", passwordConfirm: "abcd1234" })).toEqual([
      "password",
    ]);
    expect(paths({ ...valid, passwordConfirm: "abcd123?" })).toEqual(["passwordConfirm"]);
  });
});
