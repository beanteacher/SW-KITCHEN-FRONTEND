"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "@/shared/api";
import { toast } from "@/shared/lib";
import { AlertDialog } from "@/shared/ui";
import { AdminButton, AdminFormField, AdminPasswordInput, AdminTable } from "@/shared/ui/admin";
import { PasswordChangeSchema } from "../model/schema/passwordChangeSchema";
import { useChangePassword } from "../model/useChangePassword";

const EMPTY = { currentPassword: "", newPassword: "", newPasswordConfirm: "" };

interface Props {
  userId: string;
}

// 백오피스 비밀번호 변경 (고도몰형 이름 칸 표). 직원 비밀번호는 길이 규칙이 없다
export default function AdminPasswordChangeForm({ userId }: Props) {
  const { mutate: change, isPending } = useChangePassword();
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PasswordChangeSchema.FormValues>({
    resolver: zodResolver(PasswordChangeSchema.StaffSchema),
    defaultValues: EMPTY,
  });

  const onSubmit = ({ currentPassword, newPassword }: PasswordChangeSchema.FormValues) => {
    change(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          reset(EMPTY);
          setDone(true);
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === "PASSWORD_MISMATCH") {
            setError("currentPassword", { message: error.message }, { shouldFocus: true });
            return;
          }
          toast(error.message, "error");
        },
      },
    );
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <AdminTable>
        <div className="flex border-b border-admin-head-line text-[13px]">
          <span className="w-[140px] shrink-0 bg-admin-fill px-4 py-2 leading-8 font-semibold text-admin-text">
            아이디
          </span>
          <span className="px-3 py-2 leading-8">{userId}</span>
        </div>
        <AdminFormField label="현재 비밀번호" error={errors.currentPassword?.message}>
          {(control) => (
            <AdminPasswordInput
              {...register("currentPassword")}
              {...control}
              autoComplete="current-password"
              className="max-w-[320px]"
            />
          )}
        </AdminFormField>
        <AdminFormField label="새 비밀번호" error={errors.newPassword?.message}>
          {(control) => (
            <AdminPasswordInput
              {...register("newPassword")}
              {...control}
              autoComplete="new-password"
              className="max-w-[320px]"
            />
          )}
        </AdminFormField>
        <AdminFormField label="새 비밀번호 확인" error={errors.newPasswordConfirm?.message}>
          {(control) => (
            <AdminPasswordInput
              {...register("newPasswordConfirm")}
              {...control}
              autoComplete="new-password"
              className="max-w-[320px]"
            />
          )}
        </AdminFormField>
      </AdminTable>
      <div className="mt-3.5 flex justify-center">
        <AdminButton type="submit" className="h-9 min-w-[120px]" disabled={isPending}>
          비밀번호 바꾸기
        </AdminButton>
      </div>
      <AlertDialog open={done} kind="success" title="변경 완료" onClose={() => setDone(false)}>
        비밀번호를 바꿨습니다. 다른 기기는 로그아웃됩니다.
      </AlertDialog>
    </form>
  );
}
