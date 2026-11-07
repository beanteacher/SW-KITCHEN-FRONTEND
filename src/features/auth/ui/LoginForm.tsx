"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "@/shared/api";
import { cn } from "@/shared/lib";
import { AlertDialog, PasswordToggle } from "@/shared/ui";
import {
  LOGIN_ERROR_MESSAGE,
  LOGIN_FALLBACK_MESSAGE,
  SOCIAL_LOGIN_ERROR,
} from "../config/loginMessage";
import { getAfterLoginPath } from "../lib/redirect";
import { AuthSchema } from "../model/schema/authSchema";
import { useLogin } from "../model/useAuthQueries";
import SocialLoginButtons, { SOCIAL_BUTTON_CLASS } from "./SocialLoginButtons";
import Turnstile from "./Turnstile";

// 무신사 로그인 실측: 36px 칸, 회색 테두리, 둥글기 4. 오류는 빨간 테두리 + 칸 아래 11px 글씨
function FieldBox({ invalid, children }: { invalid: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex h-9 rounded-[4px] border",
        // 오류가 있으면 초점이 있어도 빨간 테두리를 그대로 둔다
        invalid ? "border-store-danger" : "border-[#e0e0e0] focus-within:border-black",
      )}
    >
      {children}
    </div>
  );
}

const INPUT_CLASS =
  "h-full min-w-0 flex-1 rounded-[4px] bg-transparent px-2 text-sm outline-none placeholder:text-placeholder";

function FieldMessage({ children }: { children: ReactNode }) {
  return <p className="mx-0.5 mt-1.5 text-[11px] leading-[14px] text-store-danger">{children}</p>;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="mb-3">
          <FieldBox invalid={Boolean(errors.userId)}>
            <input
              {...register("userId")}
              autoFocus
              autoComplete="username"
              aria-label="아이디"
              aria-invalid={Boolean(errors.userId)}
              placeholder="아이디"
              className={INPUT_CLASS}
            />
          </FieldBox>
          {errors.userId && <FieldMessage>{errors.userId.message}</FieldMessage>}
        </div>
        <div className="mb-3">
          <FieldBox invalid={Boolean(errors.password)}>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-label="비밀번호"
              aria-invalid={Boolean(errors.password)}
              placeholder="비밀번호"
              className={INPUT_CLASS}
            />
            <PasswordToggle
              shown={showPassword}
              onToggle={() => setShowPassword((shown) => !shown)}
            />
          </FieldBox>
          {errors.password && <FieldMessage>{errors.password.message}</FieldMessage>}
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
          className="mt-[18px] h-11 w-full rounded-[4px] border border-black bg-black text-sm font-medium text-white disabled:opacity-40"
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
