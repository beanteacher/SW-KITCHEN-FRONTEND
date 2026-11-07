"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { ApiError } from "@/shared/api";
import { applyServerFieldErrors, toast } from "@/shared/lib";
import { Dialog } from "@/shared/ui";
import {
  AdminButton,
  AdminFieldError,
  AdminInput,
  AdminPasswordInput,
  AdminSegment,
} from "@/shared/ui/admin";
import { StaffSchema } from "../model/schema/staffSchema";
import { useCreateStaff } from "../model/useStaffAdminActions";

const FORM_ID = "staff-add-form";
const ROLE_OPTIONS = [
  { value: "STAFF" as const, label: "담당자" },
  { value: "ADMIN" as const, label: "관리자" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

function Row({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="mb-3 text-ink">
      <p className="mb-1 text-xs font-semibold text-admin-text">{label}</p>
      {children}
      {error && <AdminFieldError>{error}</AdminFieldError>}
    </div>
  );
}

// 가운데 창: 아이디 · 이름 · 역할 · 비밀번호 · 비밀번호 확인. 추가하면 창을 닫는다
export default function StaffAddDialog({ open, onClose }: Props) {
  const { mutate: create, isPending } = useCreateStaff();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<StaffSchema.CreateFormValues>({
    resolver: zodResolver(StaffSchema.CreateSchema),
    defaultValues: { userId: "", name: "", role: "STAFF", password: "", passwordConfirm: "" },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: StaffSchema.CreateFormValues) => {
    create(values, {
      onSuccess: () => {
        toast("직원 계정을 만들었습니다.");
        close();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.code === "USER_ID_DUPLICATE") {
          setError("userId", { message: "이미 있는 아이디입니다." }, { shouldFocus: true });
          return;
        }
        if (applyServerFieldErrors(error, setError) === 0) toast(error.message, "error");
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      title="직원 추가"
      actions={
        <>
          <AdminButton variant="outline" onClick={close}>
            취소
          </AdminButton>
          <AdminButton type="submit" form={FORM_ID} disabled={isPending}>
            추가
          </AdminButton>
        </>
      }
    >
      <form id={FORM_ID} noValidate onSubmit={handleSubmit(onSubmit)}>
        <Row label="아이디" error={errors.userId?.message}>
          <AdminInput
            {...register("userId")}
            maxLength={20}
            placeholder="영문 소문자·숫자 4~20자"
            aria-label="아이디"
            aria-invalid={Boolean(errors.userId)}
          />
        </Row>
        <Row label="이름" error={errors.name?.message}>
          <AdminInput
            {...register("name")}
            maxLength={20}
            placeholder="1~20자"
            aria-label="이름"
            aria-invalid={Boolean(errors.name)}
          />
        </Row>
        <Row label="역할">
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <AdminSegment
                aria-label="역할"
                options={ROLE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </Row>
        <Row label="비밀번호" error={errors.password?.message}>
          <AdminPasswordInput
            {...register("password")}
            autoComplete="new-password"
            placeholder="직원에게 따로 알려 주세요"
            aria-label="비밀번호"
            aria-invalid={Boolean(errors.password)}
          />
        </Row>
        <Row label="비밀번호 확인" error={errors.passwordConfirm?.message}>
          <AdminPasswordInput
            {...register("passwordConfirm")}
            autoComplete="new-password"
            aria-label="비밀번호 확인"
            aria-invalid={Boolean(errors.passwordConfirm)}
          />
        </Row>
      </form>
    </Dialog>
  );
}
