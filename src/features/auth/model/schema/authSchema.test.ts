import { describe, expect, it } from "vitest";
import { AuthSchema } from "./authSchema";

describe("로그인 입력 검사", () => {
  it("아이디와 비밀번호가 있으면 형식과 상관없이 통과한다", () => {
    expect(AuthSchema.LoginSchema.safeParse({ userId: "Admin!", password: "1" }).success).toBe(
      true,
    );
  });

  it("빈 칸이면 칸마다 안내 문구를 준다", () => {
    const result = AuthSchema.LoginSchema.safeParse({ userId: "  ", password: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toEqual([
      "아이디를 입력해 주세요.",
      "비밀번호를 입력해 주세요.",
    ]);
  });
});
