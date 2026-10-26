import { z } from "zod";

export * as AuthSchema from "./authSchema";

// 형식은 검사하지 않는다. 틀린 이유를 알려 주지 않으려고 서버가 한 가지 오류로만 답한다
export const LoginSchema = z.object({
  userId: z.string().trim().min(1, "아이디를 입력해 주세요."),
  password: z.string().min(1, "비밀번호를 입력해 주세요."),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
