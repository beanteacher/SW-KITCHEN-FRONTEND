"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { type MemberDto, PasswordRules } from "@/entities/member";
import { ApiError } from "@/shared/api";
import { applyServerFieldErrors, formatPhone } from "@/shared/lib";
import {
  StoreField,
  StoreFieldMessage,
  StoreInput,
  StorePasswordInput,
  StoreReadonlyInput,
} from "@/shared/ui";
import { SignupSchema, USER_ID_MESSAGE, USER_ID_PATTERN } from "../model/schema/signupSchema";
import { useCheckUserId } from "../model/useSignupActions";

export const ACCOUNT_FORM_ID = "signup-account-form";

interface Props {
  verified: MemberDto.VerifiedIdentity;
  onSubmit: (
    values: SignupSchema.AccountFormValues,
    setServerError: (error: unknown) => void,
  ) => void;
  // 아이디 중복 확인을 통과하고 규칙을 다 채웠는지. 아래 [가입하기] 를 켜고 끈다
  onReadyChange: (ready: boolean) => void;
}

// ③ 아이디·비밀번호. 맨 위에 본인확인으로 받은 정보를 고칠 수 없는 칸으로 둔다
export default function AccountForm({ verified, onSubmit, onReadyChange }: Props) {
  const { mutate: checkUserId, isPending: checking } = useCheckUserId();
  // 중복 확인을 통과한 아이디. 아이디를 고치면 다시 확인해야 한다
  const [checkedUserId, setCheckedUserId] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<SignupSchema.AccountFormValues>({
    resolver: zodResolver(SignupSchema.AccountSchema),
    defaultValues: { userId: "", password: "", passwordConfirm: "" },
  });
  const [userId, password, passwordConfirm] = useWatch({
    control,
    name: ["userId", "password", "passwordConfirm"],
  });
  const userIdOk = checkedUserId !== null && checkedUserId === userId.trim();
  const ready =
    userIdOk && SignupSchema.AccountSchema.safeParse({ userId, password, passwordConfirm }).success;
  useEffect(() => onReadyChange(ready), [ready, onReadyChange]);

  const handleCheck = () => {
    const value = getValues("userId").trim();
    if (!USER_ID_PATTERN.test(value)) {
      setError("userId", { message: USER_ID_MESSAGE });
      return;
    }
    checkUserId(value, {
      onSuccess: ({ available }) => {
        if (available) {
          clearErrors("userId");
          setCheckedUserId(value);
          return;
        }
        setCheckedUserId(null);
        setError("userId", { message: "이미 쓰고 있는 아이디입니다." });
      },
      onError: (error) => setError("userId", { message: error.message }),
    });
  };

  const setServerError = (error: unknown) => {
    if (error instanceof ApiError && error.code === "USER_ID_DUPLICATE") {
      setCheckedUserId(null);
      setError("userId", { message: "이미 쓰고 있는 아이디입니다." }, { shouldFocus: true });
      return;
    }
    applyServerFieldErrors(error, setError);
  };

  return (
    <form
      id={ACCOUNT_FORM_ID}
      noValidate
      onSubmit={handleSubmit((values) => onSubmit(values, setServerError))}
    >
      <StoreField label="이름">
        <StoreReadonlyInput value={verified.name} note="본인확인 정보" aria-label="이름" />
      </StoreField>
      <StoreField label="생년월일">
        <StoreReadonlyInput value={verified.birthDate} note="본인확인 정보" aria-label="생년월일" />
      </StoreField>
      <StoreField label="휴대폰 번호">
        <StoreReadonlyInput
          value={formatPhone(verified.phone)}
          note="본인확인 정보"
          aria-label="휴대폰 번호"
        />
      </StoreField>
      <StoreField label="아이디" htmlFor="signup-user-id">
        <div className="flex gap-2">
          <StoreInput
            {...register("userId")}
            id="signup-user-id"
            tone={errors.userId ? "error" : userIdOk ? "ok" : "default"}
            maxLength={20}
            autoComplete="username"
            placeholder="영문 소문자·숫자 4~20자"
          />
          <button
            type="button"
            onClick={handleCheck}
            disabled={checking}
            className="h-9 rounded-[4px] border border-[#e0e0e0] px-3 text-[13px] whitespace-nowrap"
          >
            중복 확인
          </button>
        </div>
        {errors.userId ? (
          <StoreFieldMessage>{errors.userId.message}</StoreFieldMessage>
        ) : (
          userIdOk && <StoreFieldMessage tone="ok">사용할 수 있는 아이디입니다.</StoreFieldMessage>
        )}
      </StoreField>
      <StoreField label="비밀번호" htmlFor="signup-password">
        <StorePasswordInput
          {...register("password")}
          id="signup-password"
          tone={errors.password ? "error" : "default"}
          autoComplete="new-password"
          placeholder="8자 이상, 영문·숫자·특수문자"
        />
        <PasswordRules value={password} />
        {errors.password && <StoreFieldMessage>{errors.password.message}</StoreFieldMessage>}
      </StoreField>
      <StoreField label="비밀번호 확인" htmlFor="signup-password-confirm">
        <StorePasswordInput
          {...register("passwordConfirm")}
          id="signup-password-confirm"
          tone={errors.passwordConfirm ? "error" : "default"}
          autoComplete="new-password"
          placeholder="비밀번호를 한 번 더 입력"
        />
        {errors.passwordConfirm && (
          <StoreFieldMessage>{errors.passwordConfirm.message}</StoreFieldMessage>
        )}
      </StoreField>
    </form>
  );
}
