"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "@/shared/api";
import { cn } from "@/shared/lib";
import { AlertDialog } from "@/shared/ui";
import { getAfterLoginPath } from "../lib/redirect";
import { AuthSchema } from "../model/schema/authSchema";
import { useLogin } from "../model/useAuthQueries";

const LOGIN_FAILED_MESSAGE = "아이디 또는 비밀번호가 맞지 않습니다.";
const FALLBACK_MESSAGE = "로그인하지 못했습니다. 잠시 뒤 다시 시도해 주세요.";

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

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<AuthSchema.LoginFormValues>({ resolver: zodResolver(AuthSchema.LoginSchema) });

  const onSubmit = (values: AuthSchema.LoginFormValues) => {
    login(values, {
      onSuccess: (result) => {
        const path = getAfterLoginPath(searchParams.get("redirect"), result.role);
        if (result.passwordChangeRecommended) {
          setPendingPath(path);
          return;
        }
        router.replace(path);
      },
      onError: () => resetField("password"),
    });
  };

  const failMessage =
    error instanceof ApiError && error.code === "LOGIN_FAILED"
      ? LOGIN_FAILED_MESSAGE
      : FALLBACK_MESSAGE;

  return (
    <>
      {/* 화면 코드가 뜨기 전에 눌려도 아이디·비밀번호가 주소창(GET)에 붙지 않게 POST 로 둔다 */}
      <form method="post" onSubmit={handleSubmit(onSubmit)} noValidate>
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
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              className="grid w-9 place-items-center text-placeholder"
            >
              {/* 아이콘은 지금 상태를 보여준다: 가려져 있으면 감은 눈, 보이면 뜬 눈 (무신사와 같음) */}
              {showPassword ? (
                <Eye className="size-5" strokeWidth={1.6} aria-hidden />
              ) : (
                <EyeOff className="size-5" strokeWidth={1.6} aria-hidden />
              )}
            </button>
          </FieldBox>
          {errors.password && <FieldMessage>{errors.password.message}</FieldMessage>}
        </div>
        {error && (
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

      <AlertDialog
        open={pendingPath !== null}
        kind="notice"
        title="비밀번호 변경 권장"
        onClose={() => pendingPath && router.replace(pendingPath)}
      >
        처음 받은 비밀번호를 쓰고 있습니다. 비밀번호를 바꿔 주세요.
      </AlertDialog>
    </>
  );
}
