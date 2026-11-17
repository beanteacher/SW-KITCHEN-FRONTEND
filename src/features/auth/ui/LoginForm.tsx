"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SOCIAL_BUTTON_CLASS, SocialLoginButtons } from "@/entities/member";
import { ApiError } from "@/shared/api";
import { cn } from "@/shared/lib";
import {
  AlertDialog,
  standaloneButtonClass,
  StoreFieldMessage,
  StoreInput,
  StorePasswordInput,
} from "@/shared/ui";
import {
  LOGIN_ERROR_MESSAGE,
  LOGIN_FALLBACK_MESSAGE,
  SOCIAL_LOGIN_ERROR,
} from "../config/loginMessage";
import { getAfterLoginPath } from "../lib/redirect";
import { AuthSchema } from "../model/schema/authSchema";
import { useLogin } from "../model/useAuthQueries";
import Turnstile from "./Turnstile";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: login, isPending, error } = useLogin();
  // 처음 받은 비밀번호면 안내를 보여준 뒤 이동한다
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  // 5번 틀린 아이디로 다시 시도하면 서버가 보안문자를 요구한다. 풀면 같은 아이디·비밀번호로 다시 보낸다
  const [captchaFor, setCaptchaFor] = useState<AuthSchema.LoginFormValues | null>(null);
  const redirect = searchParams.get("redirect");
  const socialFailed = searchParams.get("error") === "social";

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<AuthSchema.LoginFormValues>({ resolver: zodResolver(AuthSchema.LoginSchema) });

  const onSubmit = (values: AuthSchema.LoginFormValues, captchaToken?: string) => {
    login(
      { ...values, captchaToken },
      {
        onSuccess: (result) => {
          setCaptchaFor(null);
          const path = getAfterLoginPath(redirect, result.role);
          if (result.passwordChangeRecommended) {
            setPendingPath(path);
            return;
          }
          router.replace(path);
        },
        onError: (loginError) => {
          if (loginError instanceof ApiError && loginError.code === "CAPTCHA_REQUIRED") {
            setCaptchaFor(values);
            return;
          }
          setCaptchaFor(null);
          resetField("password");
        },
      },
    );
  };

  const failMessage = (() => {
    if (error instanceof ApiError) return LOGIN_ERROR_MESSAGE[error.code] ?? LOGIN_FALLBACK_MESSAGE;
    if (error) return LOGIN_FALLBACK_MESSAGE;
    return socialFailed ? SOCIAL_LOGIN_ERROR : null;
  })();

  return (
    <>
      {/* 화면 코드가 뜨기 전에 눌려도 아이디·비밀번호가 주소창(GET)에 붙지 않게 POST 로 둔다 */}
      <form method="post" onSubmit={handleSubmit((values) => onSubmit(values))} noValidate>
        {/* 무신사 로그인 실측: 36px 칸, 회색 테두리, 둥글기 4. 오류는 빨간 테두리 + 칸 아래 11px 글씨 */}
        <div className="mb-3">
          <StoreInput
            {...register("userId")}
            tone={errors.userId ? "error" : "default"}
            autoFocus
            autoComplete="username"
            aria-label="아이디"
            placeholder="아이디"
          />
          {errors.userId && <StoreFieldMessage>{errors.userId.message}</StoreFieldMessage>}
        </div>
        <div className="mb-3">
          <StorePasswordInput
            {...register("password")}
            tone={errors.password ? "error" : "default"}
            autoComplete="current-password"
            aria-label="비밀번호"
            placeholder="비밀번호"
          />
          {errors.password && <StoreFieldMessage>{errors.password.message}</StoreFieldMessage>}
        </div>
        {captchaFor && <Turnstile onVerify={(token) => onSubmit(captchaFor, token)} />}
        {failMessage && (
          <p role="alert" className="mx-0.5 mt-1 text-[13px] leading-[18px] text-store-danger">
            {failMessage}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className={cn(standaloneButtonClass(), "mt-[18px] disabled:opacity-40")}
        >
          {isPending ? "로그인 중…" : "로그인"}
        </button>
      </form>

      <div className="mt-8 flex flex-col gap-3">
        <SocialLoginButtons returnUrl={redirect ?? undefined} />
        <Link href="/signup" className={cn(SOCIAL_BUTTON_CLASS, "bg-white text-black")}>
          아이디로 가입하기
        </Link>
      </div>
      <p className="mt-6 flex justify-center gap-2 text-[13px] text-placeholder">
        <Link href="/find/id">아이디 찾기</Link>
        <span aria-hidden className="mt-0.5 h-3 w-px bg-[#e0e0e0]" />
        <Link href="/find/password">비밀번호 찾기</Link>
      </p>

      <AlertDialog
        open={pendingPath !== null}
        kind="notice"
        title="비밀번호 변경 권장"
        onClose={() => {
          if (!pendingPath) return;
          // Next 가 이 화면을 숨겨 두었다가 다시 보여 줄 때 창이 다시 열리지 않게 비운다
          setPendingPath(null);
          router.replace(pendingPath);
        }}
      >
        처음 받은 비밀번호를 쓰고 있습니다. 비밀번호를 바꿔 주세요.
      </AlertDialog>
    </>
  );
}
