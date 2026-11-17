import { z } from "zod";
import { CUSTOMER_PASSWORD_MESSAGE, isCustomerPassword } from "@/entities/member";

export * as SignupSchema from "./signupSchema";

export const USER_ID_PATTERN = /^[a-z0-9]{4,20}$/;
export const USER_ID_MESSAGE = "영문 소문자·숫자 4~20자로 입력해 주세요.";

export const AccountSchema = z
  .object({
    userId: z.string().trim().regex(USER_ID_PATTERN, USER_ID_MESSAGE),
    password: z.string().refine(isCustomerPassword, CUSTOMER_PASSWORD_MESSAGE),
    passwordConfirm: z.string(),
  })
  .refine((values) => values.password === values.passwordConfirm, {
    message: "비밀번호가 같지 않습니다.",
    path: ["passwordConfirm"],
  });

export type AccountFormValues = z.infer<typeof AccountSchema>;
