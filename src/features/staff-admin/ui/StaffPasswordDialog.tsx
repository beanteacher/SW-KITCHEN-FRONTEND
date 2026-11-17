"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { MemberDto } from "@/entities/member";
import { toast } from "@/shared/lib";
import { Dialog } from "@/shared/ui";
import {
  AdminButton,
  AdminErrorNotice,
  AdminFieldError,
  AdminPasswordInput,
} from "@/shared/ui/admin";
import { StaffSchema } from "../model/schema/staffSchema";
import { useResetStaffPassword } from "../model/useStaffAdminActions";

const FORM_ID = "staff-password-form";

interface Props {
  staff: MemberDto.Staff | null;
  onClose: () => void;
}

// 관리자가 직원 비밀번호를 새로 정한다. 바꾼 비밀번호는 관리자가 직원에게 따로 알린다
export default function StaffPasswordDialog({ staff, onClose }: Props) {
  const { mutate: resetPassword, isPending } = useResetStaffPassword();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<StaffSchema.PasswordFormValues>({
    resolver: zodResolver(StaffSchema.PasswordSchema),
    defaultValues: { password: "", passwordConfirm: "" },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = ({ password }: StaffSchema.PasswordFormValues) => {
    if (!staff) return;
    resetPassword(
      { id: staff.id, password },
      {
        onSuccess: () => {
          toast("비밀번호를 바꿨습니다.");
          close();
        },
        // 칸 하나의 오류가 아니면 창 안 맨 아래에 남긴다
        onError: (error) => setError("root", { message: error.message }),
      },
    );
  };

  return (
    <Dialog
      open={staff !== null}
      onClose={close}
      title="비밀번호 변경하기"
      actions={
        <>
          <AdminButton variant="outline" onClick={close}>
            취소
          </AdminButton>
          <AdminButton type="submit" form={FORM_ID} disabled={isPending}>
            변경하기
          </AdminButton>
        </>
      }
    >
      <form id={FORM_ID} noValidate onSubmit={handleSubmit(onSubmit)}>
        <p className="mb-3">
          <b className="text-ink">
            {staff?.userId} ({staff?.name})
          </b>{" "}
          계정의 비밀번호를 새로 정합니다. 그 직원은 모든 기기에서 로그아웃됩니다.
        </p>
        <p className="mb-1 text-xs font-semibold text-admin-text">새 비밀번호</p>
        <AdminPasswordInput
          {...register("password")}
          autoComplete="new-password"
          aria-label="새 비밀번호"
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password && <AdminFieldError>{errors.password.message}</AdminFieldError>}
        <p className="mt-3 mb-1 text-xs font-semibold text-admin-text">새 비밀번호 확인</p>
        <AdminPasswordInput
          {...register("passwordConfirm")}
          autoComplete="new-password"
          aria-label="새 비밀번호 확인"
          aria-invalid={Boolean(errors.passwordConfirm)}
        />
        {errors.passwordConfirm && (
          <AdminFieldError>{errors.passwordConfirm.message}</AdminFieldError>
        )}
        {errors.root && <AdminErrorNotice className="mt-3">{errors.root.message}</AdminErrorNotice>}
      </form>
    </Dialog>
  );
}
