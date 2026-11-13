"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IDENTITY_CANCELLED, type MemberDto, useVerifyIdentity } from "@/entities/member";
import { ApiError } from "@/shared/api";
import { StandalonePage, standaloneButtonClass, StoreFieldMessage } from "@/shared/ui";
import type { SignupDto } from "../model/dto/signupDto";
import { useSignup } from "../model/useSignupActions";
import AccountChip from "./AccountChip";
import AccountForm, { ACCOUNT_FORM_ID } from "./AccountForm";
import ResultView from "./ResultView";
import SignupHeading from "./SignupHeading";
import SignupSteps from "./SignupSteps";
import TermsAgreement, { REQUIRED_AGREED } from "./TermsAgreement";

const STEP_NAMES = ["약관 동의", "본인확인", "아이디·비밀번호"];
const NO_AGREEMENTS: SignupDto.Agreements = { terms: false, privacy: false, marketing: false };

type Step =
  | { kind: "terms" }
  | { kind: "account"; verified: MemberDto.VerifiedIdentity }
  | { kind: "exists"; account: MemberDto.ExistingAccount }
  | { kind: "underage" }
  | { kind: "done"; name: string };

// 아이디 가입: ① 약관 동의 → ② 본인확인(업체 창) → ③ 아이디·비밀번호 (무신사와 같음)
export default function SignupFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  // 가입하면 로그인된다. 로그인 전에 받아 둔 내 정보(로그인 안 됨)를 버리고 다시 읽게 한다
  const enterStore = (path: string) => {
    queryClient.clear();
    router.push(path);
  };
  const afterSignup = safePath(searchParams.get("redirect")) ?? "/product/new";
  const [step, setStep] = useState<Step>({ kind: "terms" });
  const [agreements, setAgreements] = useState(NO_AGREEMENTS);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [accountReady, setAccountReady] = useState(false);
  const { mutate: verify, isPending: verifying } = useVerifyIdentity("SIGNUP");
  const { mutate: signup, isPending: signingUp } = useSignup();

  const handleVerify = () => {
    setTermsError(null);
    verify(undefined, {
      onSuccess: (verified) => {
        if (verified.existingAccount) {
          setStep({ kind: "exists", account: verified.existingAccount });
          return;
        }
        setStep({ kind: "account", verified });
      },
      onError: (error) => {
        if (error instanceof ApiError && error.code === "UNDER_AGE") {
          setStep({ kind: "underage" });
          return;
        }
        setTermsError(
          error instanceof ApiError && error.code !== IDENTITY_CANCELLED
            ? error.message
            : "본인확인을 마치지 못했습니다. 다시 시도해 주세요.",
        );
      },
    });
  };

  const renderBody = () => {
    switch (step.kind) {
      case "terms":
        return (
          <>
            <SignupSteps names={STEP_NAMES} current={0} />
            {termsError && (
              <div className="-mt-3 mb-3.5">
                <StoreFieldMessage>{termsError}</StoreFieldMessage>
              </div>
            )}
            <SignupHeading title="성원종합주방 회원가입">
              약관에 동의하고 휴대폰 본인확인을 하면 아이디를 만들 수 있습니다.
            </SignupHeading>
            <TermsAgreement value={agreements} onChange={setAgreements} />
          </>
        );
      case "account":
        return (
          <>
            <SignupSteps names={STEP_NAMES} current={2} />
            <SignupHeading title="아이디·비밀번호 만들기">
              로그인할 때 쓸 아이디와 비밀번호를 정해 주세요.
            </SignupHeading>
            <AccountForm
              verified={step.verified}
              onReadyChange={setAccountReady}
              onSubmit={({ userId, password }, setServerError) =>
                signup(
                  { userId, password, agreements },
                  {
                    onSuccess: (result) =>
                      setStep({ kind: "done", name: result.name ?? step.verified.name }),
                    onError: (error) => {
                      if (error instanceof ApiError && error.code === "ACCOUNT_ALREADY_EXISTS") {
                        setStep({ kind: "exists", account: {} });
                        return;
                      }
                      if (
                        error instanceof ApiError &&
                        error.code === "IDENTITY_VERIFICATION_REQUIRED"
                      ) {
                        setTermsError(error.message);
                        setStep({ kind: "terms" });
                        return;
                      }
                      setServerError(error);
                    },
                  },
                )
              }
            />
          </>
        );
      case "exists":
        return (
          <ResultView
            title="이미 가입된 계정이 있습니다"
            actions={
              <>
                <Link href="/login" className={standaloneButtonClass()}>
                  로그인하기
                </Link>
                <Link href="/find/id" className={standaloneButtonClass("line")}>
                  아이디 찾기
                </Link>
              </>
            }
          >
            <p>
              한 사람은 계정 하나만 만들 수 있습니다.
              <br />
              아래 계정으로 로그인해 주세요.
            </p>
            {(step.account.maskedUserId || step.account.linkedProviders?.length) && (
              <div className="mt-7">
                <AccountChip account={step.account} />
              </div>
            )}
          </ResultView>
        );
      case "underage":
        return (
          <ResultView
            title="만 14세 이상만 가입할 수 있습니다"
            actions={
              <Link href="/product/new" className={standaloneButtonClass("line")}>
                쇼핑몰로 돌아가기
              </Link>
            }
          >
            본인확인 결과 만 14세 미만이라 가입할 수 없습니다.
          </ResultView>
        );
      case "done":
        return (
          <ResultView
            title="가입을 마쳤습니다"
            actions={
              <button
                type="button"
                className={standaloneButtonClass()}
                onClick={() => enterStore(afterSignup)}
              >
                쇼핑 계속하기
              </button>
            }
          >
            {step.name}님, 환영합니다.
            <br />
            로그인된 상태로 쇼핑을 이어 갑니다.
          </ResultView>
        );
    }
  };

  const footer =
    step.kind === "terms" ? (
      <button
        type="button"
        className={standaloneButtonClass()}
        disabled={!REQUIRED_AGREED(agreements) || verifying}
        onClick={handleVerify}
      >
        동의하고 본인확인하기
      </button>
    ) : step.kind === "account" ? (
      <button
        type="submit"
        form={ACCOUNT_FORM_ID}
        className={standaloneButtonClass()}
        disabled={!accountReady || signingUp}
      >
        가입하기
      </button>
    ) : undefined;

  return (
    <StandalonePage
      title="회원가입"
      backHref={step.kind === "account" ? undefined : "/login"}
      onBack={step.kind === "account" ? () => setStep({ kind: "terms" }) : undefined}
      footer={footer}
    >
      {renderBody()}
    </StandalonePage>
  );
}

// 이 사이트 안 주소만 받는다 (//, http: 같은 바깥 주소로 보내는 공격 막기)
function safePath(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")
    ? value
    : null;
}
