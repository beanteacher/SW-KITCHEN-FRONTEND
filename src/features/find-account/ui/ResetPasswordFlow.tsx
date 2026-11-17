"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { IDENTITY_CANCELLED, PasswordRules, useVerifyIdentity } from "@/entities/member";
import { ApiError } from "@/shared/api";
import {
  StandaloneHeading,
  StandalonePage,
  StandaloneResult,
  standaloneButtonClass,
  StoreField,
  StoreFieldMessage,
  StoreInput,
  StorePasswordInput,
} from "@/shared/ui";
import { ResetSchema } from "../model/schema/resetSchema";
import { useCheckUserId, useFindId, useResetPassword } from "../model/useFindAccountActions";
import FindTabs from "./FindTabs";

type Step = "userId" | "verify" | "reset" | "done";

const VERIFY_FAILED = "본인확인을 마치지 못했습니다. 다시 시도해 주세요.";
const MISMATCH = "입력한 아이디는 본인확인한 분의 계정이 아닙니다. 아이디를 다시 확인해 주세요.";
const EXPIRED = "본인확인한 지 10분이 지났습니다. 다시 본인확인해 주세요.";

// 비밀번호 재설정 (무신사와 같음): ① 아이디 → ② 본인확인 안내 → ③ 새 비밀번호
// ② 를 따로 두는 까닭: 업체 창은 사용자가 직접 누른 버튼으로만 열린다 (아이디 확인을 기다렸다 열면 브라우저가 막는다)
export default function ResetPasswordFlow() {
  const searchParams = useSearchParams();
  // 아이디 찾기에서 방금 본인확인을 마치고 온 경우 바로 ③ 으로 간다
  const fromFindId = searchParams.get("verified") === "1" ? searchParams.get("userId") : null;
  const [step, setStep] = useState<Step>(fromFindId ? "reset" : "userId");
  const [userId, setUserId] = useState(fromFindId ?? "");
  const [userIdError, setUserIdError] = useState<string | null>(null);
  const [topError, setTopError] = useState<string | null>(null);
  // 서버가 본인확인 시간이 지났다고 하면 ③ 의 버튼이 본인확인으로 바뀐다
  const [expired, setExpired] = useState(false);

  const { mutate: checkUserId, isPending: checking } = useCheckUserId();
  const { mutate: verify, isPending: verifying } = useVerifyIdentity("FIND");
  const { mutate: findId, isPending: finding } = useFindId();
  const { mutate: resetPassword, isPending: resetting } = useResetPassword();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetSchema.FormValues>({
    resolver: zodResolver(ResetSchema.PasswordSchema),
    defaultValues: { newPassword: "", newPasswordConfirm: "" },
  });
  const [newPassword, newPasswordConfirm] = useWatch({
    control,
    name: ["newPassword", "newPasswordConfirm"],
  });
  const ready = ResetSchema.PasswordSchema.safeParse({ newPassword, newPasswordConfirm }).success;

  const handleUserId = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = userId.trim();
    checkUserId(value, {
      onSuccess: ({ available }) => {
        if (available) {
          setUserIdError("가입되지 않은 아이디입니다.");
          return;
        }
        setUserIdError(null);
        setTopError(null);
        setUserId(value);
        setStep("verify");
      },
      // 형식이 틀린 아이디는 서버가 400 을 준다. 그런 아이디로는 가입할 수 없다
      onError: () => setUserIdError("가입되지 않은 아이디입니다."),
    });
  };

  // 본인확인한 사람의 아이디가 입력한 아이디와 같을 때만 ③ 으로 간다 (서버도 재설정할 때 다시 본다)
  const handleVerify = () => {
    setTopError(null);
    verify(undefined, {
      onSuccess: () =>
        findId(undefined, {
          onSuccess: (account) => {
            if (account.userId !== userId) {
              setTopError(MISMATCH);
              return;
            }
            setExpired(false);
            // 10분이 지나 ③ 에서 다시 본인확인한 경우는 입력해 둔 새 비밀번호를 그대로 둔다
            if (step !== "reset") reset();
            setStep("reset");
          },
          onError: () => setTopError(MISMATCH),
        }),
      onError: (error) =>
        setTopError(
          error instanceof ApiError && error.code !== IDENTITY_CANCELLED
            ? error.message
            : VERIFY_FAILED,
        ),
    });
  };

  const onReset = ({ newPassword: password }: ResetSchema.FormValues) => {
    setTopError(null);
    resetPassword(
      { userId, newPassword: password },
      {
        onSuccess: () => setStep("done"),
        onError: (error) => {
          if (error instanceof ApiError && error.code === "IDENTITY_VERIFICATION_REQUIRED") {
            setTopError(EXPIRED);
            setExpired(true);
            return;
          }
          setTopError(
            error instanceof ApiError && error.code === "IDENTITY_MISMATCH"
              ? MISMATCH
              : error.message,
          );
        },
      },
    );
  };

  const errorLine = topError && (
    <div className="mb-3.5">
      <StoreFieldMessage>{topError}</StoreFieldMessage>
    </div>
  );

  const renderBody = () => {
    switch (step) {
      case "userId":
        return (
          <form noValidate onSubmit={handleUserId}>
            <StandaloneHeading title="비밀번호 재설정">
              비밀번호를 바꿀 계정의 아이디를 입력해 주세요.
            </StandaloneHeading>
            <StoreField label="비밀번호를 찾으려는 아이디" htmlFor="reset-user-id">
              <StoreInput
                id="reset-user-id"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                tone={userIdError ? "error" : "default"}
                maxLength={20}
                autoComplete="username"
                placeholder="아이디"
              />
              {userIdError && <StoreFieldMessage>{userIdError}</StoreFieldMessage>}
            </StoreField>
            <button
              type="submit"
              className={standaloneButtonClass()}
              disabled={!userId.trim() || checking}
            >
              다음
            </button>
            <p className="mt-4 text-center text-[13px] text-placeholder">
              아이디가 기억나지 않으면{" "}
              <Link href="/find/id" className="text-black underline">
                아이디 찾기
              </Link>
            </p>
          </form>
        );
      case "verify":
        return (
          <>
            <StandaloneHeading title="비밀번호 재설정">
              비밀번호를 찾으려면 휴대폰 본인확인이 필요해요.
            </StandaloneHeading>
            {errorLine}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className={standaloneButtonClass()}
                disabled={verifying || finding}
                onClick={handleVerify}
              >
                휴대폰 본인확인
              </button>
              {topError === MISMATCH && (
                <button
                  type="button"
                  className={standaloneButtonClass("line")}
                  onClick={() => {
                    setTopError(null);
                    setStep("userId");
                  }}
                >
                  아이디 다시 입력
                </button>
              )}
            </div>
          </>
        );
      case "reset":
        return (
          <form noValidate onSubmit={handleSubmit(onReset)}>
            <StandaloneHeading title="새 비밀번호 정하기">
              새로 쓸 비밀번호를 정해 주세요. 바꾸면 모든 기기에서 로그아웃됩니다.
            </StandaloneHeading>
            {errorLine}
            <StoreField label="새 비밀번호" htmlFor="reset-password">
              <StorePasswordInput
                {...register("newPassword")}
                id="reset-password"
                tone={errors.newPassword ? "error" : "default"}
                autoComplete="new-password"
                placeholder="8자 이상, 영문·숫자·특수문자"
              />
              <PasswordRules value={newPassword} />
              {errors.newPassword && (
                <StoreFieldMessage>{errors.newPassword.message}</StoreFieldMessage>
              )}
            </StoreField>
            <StoreField label="새 비밀번호 확인" htmlFor="reset-password-confirm">
              <StorePasswordInput
                {...register("newPasswordConfirm")}
                id="reset-password-confirm"
                tone={errors.newPasswordConfirm ? "error" : "default"}
                autoComplete="new-password"
                placeholder="한 번 더 입력"
              />
              {errors.newPasswordConfirm && (
                <StoreFieldMessage>{errors.newPasswordConfirm.message}</StoreFieldMessage>
              )}
            </StoreField>
            <div className="mt-6">
              {expired ? (
                <button
                  type="button"
                  className={standaloneButtonClass()}
                  disabled={verifying || finding}
                  onClick={handleVerify}
                >
                  휴대폰 본인확인
                </button>
              ) : (
                <button
                  type="submit"
                  className={standaloneButtonClass()}
                  disabled={!ready || resetting}
                >
                  비밀번호 바꾸기
                </button>
              )}
            </div>
          </form>
        );
      case "done":
        return (
          <StandaloneResult
            title="비밀번호를 바꿨습니다"
            actions={
              <Link href="/login" className={standaloneButtonClass()}>
                로그인하기
              </Link>
            }
          >
            새 비밀번호로 로그인해 주세요.
          </StandaloneResult>
        );
    }
  };

  return (
    <StandalonePage title="아이디·비밀번호 찾기" backHref="/login">
      <FindTabs current="password" />
      {renderBody()}
    </StandalonePage>
  );
}
