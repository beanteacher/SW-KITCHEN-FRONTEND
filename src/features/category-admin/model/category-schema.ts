import { z } from "zod";

// 서버와 같은 규칙: 이름 1~20자, 약어 영문 대문자 2자
export const categorySchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해 주세요.").max(20, "20자 이하로 입력해 주세요."),
  abbr: z.string().regex(/^[A-Z]{2}$/, "영문 대문자 2자"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
