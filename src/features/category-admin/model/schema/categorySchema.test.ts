import { describe, expect, it } from "vitest";
import { CategorySchema } from "./categorySchema";

describe("분류 입력 검사", () => {
  it("이름 1~20자와 영문 대문자 2자 약어는 통과하고, 이름 앞뒤 공백은 지운다", () => {
    const result = CategorySchema.CreateSchema.safeParse({ name: "  냉장·냉동 ", abbr: "RF" });

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("냉장·냉동");
  });

  it("빈 이름, 20자 넘는 이름, 형식이 틀린 약어는 칸마다 안내 문구를 준다", () => {
    const messages = (name: string, abbr: string) =>
      CategorySchema.CreateSchema.safeParse({ name, abbr }).error?.issues.map(
        (issue) => issue.message,
      );

    expect(messages("  ", "RF")).toEqual(["이름을 입력해 주세요."]);
    expect(messages("가".repeat(21), "RF")).toEqual(["20자 이하로 입력해 주세요."]);
    expect(messages("냉장", "R")).toEqual(["영문 대문자 2자"]);
    expect(messages("냉장", "rf")).toEqual(["영문 대문자 2자"]);
  });

  it("약어가 잠긴 수정은 약어를 검사하지 않는다", () => {
    expect(CategorySchema.getFormSchema(true).safeParse({ name: "냉장", abbr: "" }).success).toBe(
      true,
    );
    expect(CategorySchema.getFormSchema(false).safeParse({ name: "냉장", abbr: "" }).success).toBe(
      false,
    );
  });
});
