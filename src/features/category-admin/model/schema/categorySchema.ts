import { z } from "zod";

export * as CategorySchema from "./categorySchema";

// 서버와 같은 규칙: 이름 1~20자, 약어 영문 대문자 2자
const nameField = z
  .string()
  .trim()
  .min(1, "이름을 입력해 주세요.")
  .max(20, "20자 이하로 입력해 주세요.");

const abbrField = z.string().regex(/^[A-Z]{2}$/, "영문 대문자 2자");

export const CreateSchema = z.object({
  name: nameField,
  abbr: abbrField,
});

// 제품이 연결된 분류는 약어 칸이 잠겨 약어를 검사하지 않는다
export const EditLockedSchema = z.object({
  name: nameField,
  abbr: z.string(),
});

export type CreateFormValues = z.infer<typeof CreateSchema>;

export const getFormSchema = (abbrLocked?: boolean) => {
  return abbrLocked ? EditLockedSchema : CreateSchema;
};
