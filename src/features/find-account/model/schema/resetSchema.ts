import { z } from "zod";
import { CUSTOMER_PASSWORD_MESSAGE, isCustomerPassword } from "@/entities/member";

export * as ResetSchema from "./resetSchema";

export const PasswordSchema = z
  .object({
    newPassword: z.string().refine(isCustomerPassword, CUSTOMER_PASSWORD_MESSAGE),
    newPasswordConfirm: z.string(),
  })
  .refine((values) => values.newPassword === values.newPasswordConfirm, {
    message: "비밀번호가 같지 않습니다.",
    path: ["newPasswordConfirm"],
  });

export type FormValues = z.infer<typeof PasswordSchema>;
