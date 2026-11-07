import { z } from "zod";

export * as StaffSchema from "./staffSchema";

// 직원 비밀번호는 길이 규칙이 없다. 서버가 받는 72바이트까지만 막는다
const passwordField = z
  .string()
  .min(1, "비밀번호를 입력해 주세요.")
  .refine((value) => new TextEncoder().encode(value).length <= 72, "비밀번호가 너무 깁니다.");

const confirmed = <T extends { password: string; passwordConfirm: string }>(values: T) =>
  values.password === values.passwordConfirm;
const CONFIRM_ERROR = { message: "비밀번호가 같지 않습니다.", path: ["passwordConfirm"] };

export const CreateSchema = z
  .object({
    userId: z
      .string()
      .trim()
      .regex(/^[a-z0-9]{4,20}$/, "아이디는 영문 소문자·숫자 4~20자입니다."),
    name: z.string().trim().min(1, "이름을 입력해 주세요.").max(20, "이름은 20자 이하입니다."),
    role: z.enum(["STAFF", "ADMIN"]),
    password: passwordField,
    passwordConfirm: z.string(),
  })
  .refine(confirmed, CONFIRM_ERROR);

export const PasswordSchema = z
  .object({ password: passwordField, passwordConfirm: z.string() })
  .refine(confirmed, CONFIRM_ERROR);

export type CreateFormValues = z.infer<typeof CreateSchema>;
export type PasswordFormValues = z.infer<typeof PasswordSchema>;
