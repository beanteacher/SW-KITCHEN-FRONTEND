"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { PasswordRules } from "@/entities/member";
import { ApiError } from "@/shared/api";
import { applyServerFieldErrors, cn, toast } from "@/shared/lib";
import {
  standaloneButtonClass,
  StoreField,
  StoreFieldMessage,
  StorePasswordInput,
} from "@/shared/ui";
import { PasswordChangeSchema } from "../model/schema/passwordChangeSchema";
import { useChangePassword } from "../model/useChangePassword";

interface Props {
  onDone: () => void;
  onCancel: () => void;
}

// 마이페이지에서 펼치는 비밀번호 변경 (고객 비밀번호 규칙). 바꾸면 이 기기만 남고 다른 기기는 로그아웃된다
export default function CustomerPasswordChangeForm({ onDone, onCancel }: Props) {
  const { mutate: change, isPending } = useChangePassword();
  // 칸 하나에 붙일 수 없는 실패(서버 오류 등)는 버튼 위에 남긴다
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PasswordChangeSchema.FormValues>({
    resolver: zodResolver(PasswordChangeSchema.CustomerSchema),
    defaultValues: { currentPassword: "", newPassword: "", newPasswordConfirm: "" },
  });
  const values = useWatch({ control });
  const ready = PasswordChangeSchema.CustomerSchema.safeParse(values).success;

  const onSubmit = ({ currentPassword, newPassword }: PasswordChangeSchema.FormValues) => {
    setFormError(null);
    change(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          toast("비밀번호를 바꿨습니다.");
          onDone();
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === "PASSWORD_MISMATCH") {
            setError("currentPassword", { message: error.message }, { shouldFocus: true });
            return;
          }
          if (applyServerFieldErrors(error, setError) === 0) setFormError(error.message);
        },
      },
    );
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[420px] border-t-2 border-black pt-5"
    >
      <StoreField label="현재 비밀번호" htmlFor="my-current-password">
        <StorePasswordInput
          {...register("currentPassword")}
          id="my-current-password"
          tone={errors.currentPassword ? "error" : "default"}
          autoComplete="current-password"
        />
        {errors.currentPassword && (
          <StoreFieldMessage>{errors.currentPassword.message}</StoreFieldMessage>
        )}
      </StoreField>
      <StoreField label="새 비밀번호" htmlFor="my-new-password">
        <StorePasswordInput
          {...register("newPassword")}
          id="my-new-password"
          tone={errors.newPassword ? "error" : "default"}
          autoComplete="new-password"
          placeholder="8자 이상, 영문·숫자·특수문자"
        />
        <PasswordRules value={values.newPassword ?? ""} />
        {errors.newPassword && <StoreFieldMessage>{errors.newPassword.message}</StoreFieldMessage>}
      </StoreField>
      <StoreField label="새 비밀번호 확인" htmlFor="my-new-password-confirm">
        <StorePasswordInput
          {...register("newPasswordConfirm")}
          id="my-new-password-confirm"
          tone={errors.newPasswordConfirm ? "error" : "default"}
          autoComplete="new-password"
        />
        {errors.newPasswordConfirm && (
          <StoreFieldMessage>{errors.newPasswordConfirm.message}</StoreFieldMessage>
        )}
      </StoreField>
      {/* 바꾸기 전에 알린다. 바꾼 뒤 사라지는 알림에만 두지 않는다 */}
      <p className="mb-3 text-[13px] text-placeholder">
        바꾸면 이 기기만 남고 다른 기기는 로그아웃됩니다.
      </p>
      {formError && (
        <div className="mb-3">
          <StoreFieldMessage>{formError}</StoreFieldMessage>
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          className={cn(standaloneButtonClass("line"), "w-auto px-5")}
          onClick={onCancel}
        >
          취소
        </button>
        <button
          type="submit"
          className={cn(standaloneButtonClass(), "w-auto px-5")}
          disabled={!ready || isPending}
        >
          비밀번호 바꾸기
        </button>
      </div>
    </form>
  );
}
