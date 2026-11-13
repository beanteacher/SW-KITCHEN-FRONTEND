"use client";

import { useState } from "react";
import {
  type MemberDto,
  socialLoginHref,
  socialProviderPath,
  SOCIAL_PROVIDER_LABEL,
} from "@/entities/member";
import { ApiError } from "@/shared/api";
import { cn } from "@/shared/lib";
import { Dialog, standaloneButtonClass, StoreFieldMessage, StorePasswordInput } from "@/shared/ui";
import { useWithdraw } from "../model/useMyPageQueries";

export const WITHDRAW_PATH = "/my?withdraw=1";

interface Props {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
  hasPassword: boolean;
  // 소셜로만 가입한 계정: 이 소셜 로그인을 다시 하고 와야 탈퇴된다
  provider?: MemberDto.SocialProvider;
  // 소셜 로그인을 다시 하고 돌아왔는지 (주소의 표시), 실패했는지
  reauthenticated: boolean;
  reauthFailed: boolean;
}

const SMALL_BUTTON = "h-10 w-auto px-5";

// 회원 탈퇴 창: 지워지는 것 안내 + 비밀번호(아이디 가입) 또는 소셜 다시 확인(소셜로만 가입)
export default function WithdrawDialog({
  open,
  onClose,
  onDone,
  hasPassword,
  provider,
  reauthenticated,
  reauthFailed,
}: Props) {
  const { mutate: withdraw, isPending } = useWithdraw();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    reauthFailed ? "본인 확인에 실패했습니다. 가입한 계정으로 다시 로그인해 주세요." : null,
  );
  const providerName = provider ? SOCIAL_PROVIDER_LABEL[provider] : "";
  const canWithdraw = hasPassword ? password.length > 0 : reauthenticated;

  const handleWithdraw = () => {
    setError(null);
    withdraw(hasPassword ? password : undefined, {
      onSuccess: onDone,
      onError: (withdrawError) => {
        if (withdrawError instanceof ApiError && withdrawError.code === "PASSWORD_MISMATCH") {
          setError("비밀번호가 맞지 않습니다.");
          return;
        }
        if (withdrawError instanceof ApiError && withdrawError.code === "REAUTH_REQUIRED") {
          setError(`${providerName} 로그인을 다시 해 주세요.`);
          return;
        }
        setError(withdrawError.message);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="회원 탈퇴"
      actions={
        <>
          <button
            type="button"
            className={cn(standaloneButtonClass("line"), SMALL_BUTTON)}
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className={cn(
              standaloneButtonClass(),
              SMALL_BUTTON,
              "border-danger bg-danger disabled:border-[#e8e8e8]",
            )}
            disabled={!canWithdraw || isPending}
            onClick={handleWithdraw}
          >
            탈퇴하기
          </button>
        </>
      }
    >
      <ul className="mb-[18px] list-disc pl-[18px] text-[13px] leading-[21px] text-[#555]">
        <li>회원 정보(본인확인 정보·연결된 계정·동의 기록)를 바로 지우며 되돌릴 수 없습니다.</li>
        <li>법으로 보관해야 하는 주문 기록은 정해진 기간 동안 따로 보관합니다.</li>
        <li>같은 분이 다시 가입하면 새 계정으로 시작합니다.</li>
      </ul>
      {hasPassword ? (
        <>
          <label
            htmlFor="withdraw-password"
            className="mb-1.5 block text-[13px] font-medium text-black"
          >
            비밀번호 확인
          </label>
          <StorePasswordInput
            id="withdraw-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            tone={error ? "error" : "default"}
            autoComplete="current-password"
            placeholder="지금 비밀번호"
          />
        </>
      ) : (
        provider && (
          <>
            <p className="mb-3 text-[13px] text-[#555]">
              {reauthenticated
                ? `${providerName} 로그인으로 본인을 확인했습니다.`
                : `본인 확인을 위해 ${providerName} 로그인을 한 번 더 합니다.`}
            </p>
            {!reauthenticated && (
              <a
                href={socialLoginHref(socialProviderPath(provider), WITHDRAW_PATH, "reauth")}
                className={cn(
                  standaloneButtonClass(),
                  "h-10",
                  provider === "KAKAO"
                    ? "border-[#fee500] bg-[#fee500] text-black"
                    : "border-[#03c75a] bg-[#03c75a] text-white",
                )}
              >
                {providerName}로 확인
              </a>
            )}
          </>
        )
      )}
      {error && <StoreFieldMessage>{error}</StoreFieldMessage>}
    </Dialog>
  );
}
