"use client";

import Link from "next/link";
import { useState } from "react";
import {
  IDENTITY_CANCELLED,
  SOCIAL_PROVIDER_LABEL,
  SocialLoginButtons,
  socialProviderPath,
  useVerifyIdentity,
} from "@/entities/member";
import { ApiError } from "@/shared/api";
import {
  StandalonePage,
  StandaloneHeading,
  StandaloneResult,
  standaloneButtonClass,
  StoreFieldMessage,
} from "@/shared/ui";
import type { FoundAccount } from "../api/findAccountApi";
import { useFindId } from "../model/useFindAccountActions";
import FindTabs from "./FindTabs";
import FoundCard from "./FoundCard";

type Step = { kind: "start" } | { kind: "found"; account: FoundAccount } | { kind: "none" };

const VERIFY_FAILED = "본인확인을 마치지 못했습니다. 다시 시도해 주세요.";

// 아이디 찾기: 본인확인만 하면 그 사람의 계정을 보여 준다
export default function FindIdFlow() {
  const [step, setStep] = useState<Step>({ kind: "start" });
  const [error, setError] = useState<string | null>(null);
  const { mutate: verify, isPending: verifying } = useVerifyIdentity("FIND");
  const { mutate: findId, isPending: finding } = useFindId();

  const handleVerify = () => {
    setError(null);
    verify(undefined, {
      onSuccess: () =>
        findId(undefined, {
          onSuccess: (account) => setStep({ kind: "found", account }),
          onError: (findError) => {
            if (findError instanceof ApiError && findError.code === "ACCOUNT_NOT_FOUND") {
              setStep({ kind: "none" });
              return;
            }
            setError(findError.message);
          },
        }),
      onError: (verifyError) =>
        setError(
          verifyError instanceof ApiError && verifyError.code !== IDENTITY_CANCELLED
            ? verifyError.message
            : VERIFY_FAILED,
        ),
    });
  };

  const renderBody = () => {
    if (step.kind === "none") {
      return (
        <StandaloneResult
          title="가입된 계정이 없습니다"
          actions={
            <>
              <Link href="/signup" className={standaloneButtonClass()}>
                회원가입
              </Link>
              <Link href="/login" className={standaloneButtonClass("line")}>
                로그인으로
              </Link>
            </>
          }
        >
          본인확인한 분의 이름으로 가입된 계정이 없습니다.
        </StandaloneResult>
      );
    }
    if (step.kind === "found") {
      const { account } = step;
      const [first] = account.linkedProviders ?? [];
      // 소셜로만 가입했으면 아이디 대신 그 소셜 로그인 버튼
      if (!account.userId && first) {
        const name = SOCIAL_PROVIDER_LABEL[first];
        return (
          <>
            <StandaloneHeading title={`${name}로 가입한 계정입니다`}>
              {name} 로그인으로 들어와 주세요.
            </StandaloneHeading>
            <FoundCard account={account} />
            <div className="mt-6 flex flex-col gap-3">
              <SocialLoginButtons providers={[socialProviderPath(first)]} verb="로그인" />
            </div>
          </>
        );
      }
      return (
        <>
          <StandaloneHeading title="가입한 아이디입니다">
            본인확인한 분의 계정입니다.
          </StandaloneHeading>
          <FoundCard account={account} />
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/login" className={standaloneButtonClass()}>
              로그인하기
            </Link>
            {/* 방금 한 본인확인(10분)을 그대로 써서 다시 본인확인하지 않는다 */}
            <Link
              href={`/find/password?userId=${encodeURIComponent(account.userId ?? "")}&verified=1`}
              className={standaloneButtonClass("line")}
            >
              비밀번호 재설정
            </Link>
          </div>
        </>
      );
    }
    return (
      <>
        <StandaloneHeading title="아이디 찾기">
          가입할 때 본인확인한 휴대폰으로 다시 본인확인하면 아이디를 보여 드립니다.
        </StandaloneHeading>
        {error && (
          <div className="mb-3.5">
            <StoreFieldMessage>{error}</StoreFieldMessage>
          </div>
        )}
        <button
          type="button"
          className={standaloneButtonClass()}
          disabled={verifying || finding}
          onClick={handleVerify}
        >
          휴대폰 본인확인
        </button>
      </>
    );
  };

  return (
    <StandalonePage title="아이디·비밀번호 찾기" backHref="/login">
      <FindTabs current="id" />
      {renderBody()}
    </StandalonePage>
  );
}
