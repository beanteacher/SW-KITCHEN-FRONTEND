import { z } from "zod";
import { CUSTOMER_PASSWORD_MESSAGE, isCustomerPassword } from "@/entities/member";

export * as PasswordChangeSchema from "./passwordChangeSchema";

const base = {
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해 주세요."),
  newPasswordConfirm: z.string(),
};
const confirmed = (values: { newPassword: string; newPasswordConfirm: string }) =>
  values.newPassword === values.newPasswordConfirm;
const CONFIRM_ERROR = { message: "새 비밀번호가 같지 않습니다.", path: ["newPasswordConfirm"] };

// 직원은 짧아도 같아도 받는다 (서버가 받는 72바이트까지만)
export const StaffSchema = z
  .object({
    ...base,
    newPassword: z
      .string()
      .min(1, "새 비밀번호를 입력해 주세요.")
      .refine((value) => new TextEncoder().encode(value).length <= 72, "비밀번호가 너무 깁니다."),
  })
  .refine(confirmed, CONFIRM_ERROR);

export const CustomerSchema = z
  .object({
    ...base,
    newPassword: z.string().refine(isCustomerPassword, CUSTOMER_PASSWORD_MESSAGE),
  })
  .refine(confirmed, CONFIRM_ERROR);

export type FormValues = z.infer<typeof StaffSchema>;
