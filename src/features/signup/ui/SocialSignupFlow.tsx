"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  IDENTITY_CANCELLED,
  type MemberDto,
  SocialLoginButtons,
  type SocialProviderPath,
  useVerifyIdentity,
} from "@/entities/member";
import { ApiError } from "@/shared/api";
import {
  StandalonePage,
  standaloneButtonClass,
  StoreField,
  StoreFieldMessage,
  StorePasswordInput,
} from "@/shared/ui";
import type { SignupDto } from "../model/dto/signupDto";
import { useSocialLink, useSocialSignup } from "../model/useSignupActions";
import AccountChip from "./AccountChip";
import ResultView from "./ResultView";
import SignupHeading from "./SignupHeading";
import SignupSteps from "./SignupSteps";
import TermsAgreement, { REQUIRED_AGREED } from "./TermsAgreement";

const STEP_NAMES = ["약관 동의", "본인확인"];
const NO_AGREEMENTS: SignupDto.Agreements = { terms: false, privacy: false, marketing: false };
const PROVIDER_NAME: Record<SocialProviderPath, string> = { kakao: "카카오", naver: "네이버" };

type Step =
  | { kind: "terms" }
  | { kind: "link"; account: MemberDto.ExistingAccount }
  | { kind: "expired" }
  | { kind: "done"; title: string; name: string };

// 카카오·네이버로 처음 로그인한 뒤: ① 약관 동의 → ② 본인확인. 같은 사람의 계정이 있으면 그 계정에 잇는다
export default function SocialSignupFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  // 가입하면 로그인된다. 로그인 전에 받아 둔 내 정보(로그인 안 됨)를 버리고 다시 읽게 한다
  const enterStore = (path: string) => {
    queryClient.clear();
    router.push(path);
  };
  const provider: SocialProviderPath = searchParams.get("provider") === "naver" ? "naver" : "kakao";
  const providerName = PROVIDER_NAME[provider];
  const [step, setStep] = useState<Step>({ kind: "terms" });
  const [agreements, setAgreements] = useState(NO_AGREEMENTS);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const { mutate: verify, isPending: verifying } = useVerifyIdentity("SIGNUP");
  const { mutate: socialSignup, isPending: signingUp } = useSocialSignup();
  const { mutate: socialLink, isPending: linking } = useSocialLink();

  const handleFailure = (error: unknown) => {
    if (error instanceof ApiError && error.code === "SOCIAL_SIGNUP_EXPIRED") {
      setStep({ kind: "expired" });
      return true;
    }
    return false;
  };

  const handleVerify = () => {
    setTermsError(null);
    verify(undefined, {
      onSuccess: (verified) => {
        if (verified.existingAccount) {
          setStep({ kind: "link", account: verified.existingAccount });
          return;
        }
        socialSignup(agreements, {
          onSuccess: (result) =>
            setStep({
              kind: "done",
              title: "가입을 마쳤습니다",
              name: result.name ?? verified.name,
            }),
          onError: (error) => {
            if (!handleFailure(error)) setTermsError(error.message);
          },
        });
      },
      onError: (error) => {
        if (error instanceof ApiError && error.code === "UNDER_AGE") {
          setTermsError("만 14세 미만은 가입할 수 없습니다.");
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

  const handleLink = (account: MemberDto.ExistingAccount) => {
    setLinkError(null);
    socialLink(account.maskedUserId ? password : undefined, {
      onSuccess: (result) =>
        setStep({
          kind: "done",
          title: `${providerName} 계정을 연결했습니다`,
          name: result.name ?? "",
        }),
      onError: (error) => {
        if (handleFailure(error)) return;
        if (error instanceof ApiError && error.code === "PASSWORD_MISMATCH") {
          setLinkError("비밀번호가 맞지 않습니다.");
          return;
        }
        setLinkError(error.message);
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
            <SignupHeading title={`${providerName}로 시작하기`}>
              {providerName} 로그인을 마쳤습니다. 약관에 동의하고 본인확인을 하면 가입됩니다.
            </SignupHeading>
            <TermsAgreement value={agreements} onChange={setAgreements} />
          </>
        );
      case "link":
        return (
          <div className="pt-2">
            <SignupHeading title="이미 가입된 계정이 있습니다">
              본인확인한 분의 계정이 있습니다.{" "}
              {step.account.maskedUserId && "비밀번호를 한 번 확인하면 "}이 {providerName} 계정을
              연결하고, 다음부터 {providerName}로 바로 로그인됩니다.
            </SignupHeading>
            <div className="mb-[18px]">
              <AccountChip account={step.account} />
            </div>
            {step.account.maskedUserId && (
              <>
                <StoreField
                  label={`${step.account.maskedUserId} 계정의 비밀번호`}
                  htmlFor="link-password"
                >
                  <StorePasswordInput
                    id="link-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    tone={linkError ? "error" : "default"}
                    autoComplete="current-password"
                    placeholder="비밀번호"
                  />
                  {linkError && <StoreFieldMessage>{linkError}</StoreFieldMessage>}
                </StoreField>
                <p className="text-xs text-placeholder">
                  비밀번호를 잊었다면{" "}
                  <Link href="/find/password" className="text-black underline">
                    비밀번호 찾기
                  </Link>
                </p>
              </>
            )}
            {!step.account.maskedUserId && linkError && (
              <StoreFieldMessage>{linkError}</StoreFieldMessage>
            )}
          </div>
        );
      case "expired":
        return (
          <ResultView
            title="시간이 지났습니다"
            actions={<SocialLoginButtons providers={[provider]} verb="다시 시작하기" />}
          >
            {providerName} 로그인 뒤 10분이 지나 가입을 이어 갈 수 없습니다.
            <br />
            처음부터 다시 시작해 주세요.
          </ResultView>
        );
      case "done":
        return (
          <ResultView
            title={step.title}
            actions={
              <button
                type="button"
                className={standaloneButtonClass()}
                onClick={() => enterStore("/product/new")}
              >
                쇼핑 계속하기
              </button>
            }
          >
            {step.name && `${step.name}님, 환영합니다.`}
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
        disabled={!REQUIRED_AGREED(agreements) || verifying || signingUp}
        onClick={handleVerify}
      >
        동의하고 본인확인하기
      </button>
    ) : step.kind === "link" ? (
      <button
        type="button"
        className={standaloneButtonClass()}
        disabled={linking || (Boolean(step.account.maskedUserId) && !password)}
        onClick={() => handleLink(step.account)}
      >
        연결하고 로그인
      </button>
    ) : undefined;

  return (
    <StandalonePage title={`${providerName}로 시작하기`} backHref="/login" footer={footer}>
      {renderBody()}
    </StandalonePage>
  );
}
