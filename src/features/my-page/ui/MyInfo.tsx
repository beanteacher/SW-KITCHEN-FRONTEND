"use client";

import { type ReactNode, useState } from "react";
import {
  IDENTITY_CANCELLED,
  SOCIAL_PROVIDER_LABEL,
  SOCIAL_PROVIDERS,
  SocialBadge,
  useVerifyIdentity,
} from "@/entities/member";
import { ApiError } from "@/shared/api";
import { cn, formatDate, formatPhone, toast } from "@/shared/lib";
import type { MyPageApi } from "../api/myPageApi";
import { useChangeMarketing, useChangePhone } from "../model/useMyPageQueries";
import InfoRow, { InfoNote, ROW_BUTTON_CLASS } from "./InfoRow";
import MarketingSwitch from "./MarketingSwitch";

const PHONE_MISMATCH =
  "가입한 분과 다른 분의 본인확인입니다. 본인 명의 휴대폰으로 다시 본인확인해 주세요.";

interface Props {
  me: MyPageApi.Me;
  // 아이디 가입 계정만 비밀번호 줄을 둔다. 펼친 변경 칸은 위젯이 넣는다
  renderPasswordChange: (close: () => void) => ReactNode;
}

// 내 정보 표 + 비밀번호 줄
export default function MyInfo({ me, renderPasswordChange }: Props) {
  const { mutate: changeMarketing, isPending: savingMarketing } = useChangeMarketing();
  const { mutate: verify, isPending: verifying } = useVerifyIdentity("PHONE_CHANGE");
  const { mutate: changePhone, isPending: savingPhone } = useChangePhone();
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [marketingMessage, setMarketingMessage] = useState<{
    tone: "ok" | "error";
    text: string;
  } | null>(null);
  const [joinedWith] = me.linkedProviders ?? [];

  // 수신 동의·철회 결과는 법(정보통신망법 시행령 62조의2)이 알리라는 네 가지(보낸 곳·바뀐 내용·날짜·결과)를 줄 아래에 남긴다.
  // 저절로 사라지는 알림에만 두지 않는다. 실패하면 스위치는 서버 값으로 돌아가고 줄 아래 빨간 글씨
  const handleMarketing = (agreed: boolean) => {
    setMarketingMessage(null);
    changeMarketing(agreed, {
      onSuccess: () =>
        setMarketingMessage({
          tone: "ok",
          text: `성원종합주방 마케팅 정보 수신 ${agreed ? "동의" : "동의 철회"}가 ${formatDate(new Date().toISOString())}에 처리되었습니다.`,
        }),
      onError: (error) => setMarketingMessage({ tone: "error", text: error.message }),
    });
  };

  const handlePhone = () => {
    setPhoneError(null);
    verify(undefined, {
      onSuccess: () =>
        changePhone(undefined, {
          onSuccess: () => toast("휴대폰 번호를 바꿨습니다."),
          onError: (error) =>
            setPhoneError(
              error instanceof ApiError && error.code === "IDENTITY_MISMATCH"
                ? PHONE_MISMATCH
                : error.message,
            ),
        }),
      onError: (error) =>
        setPhoneError(
          error instanceof ApiError && error.code !== IDENTITY_CANCELLED
            ? error.message
            : "본인확인을 마치지 못했습니다. 다시 시도해 주세요.",
        ),
    });
  };

  return (
    <>
      <section>
        <h3 className="mb-3 text-lg font-bold">내 정보</h3>
        <dl className="border-t-2 border-black">
          <InfoRow label="아이디">
            {me.userId ? (
              <b>{me.userId}</b>
            ) : (
              joinedWith && <SocialBadge provider={joinedWith} suffix="로 가입" />
            )}
          </InfoRow>
          <InfoRow label="이름">{me.name}</InfoRow>
          <InfoRow label="생년월일">{me.birthDate}</InfoRow>
          <div className={cn(phoneError && "[&>div]:border-b-0")}>
            <InfoRow label="휴대폰 번호">
              {me.phone && formatPhone(me.phone)}
              <InfoNote>본인확인으로 바꿉니다</InfoNote>
              <button
                type="button"
                className={ROW_BUTTON_CLASS}
                disabled={verifying || savingPhone}
                onClick={handlePhone}
              >
                본인확인으로 변경
              </button>
            </InfoRow>
            {phoneError && <RowMessage tone="error">{phoneError}</RowMessage>}
          </div>
          <InfoRow label="연결된 계정">
            {SOCIAL_PROVIDERS.map((provider) =>
              me.linkedProviders?.includes(provider) ? (
                <SocialBadge key={provider} provider={provider} />
              ) : (
                <span
                  key={provider}
                  className="inline-flex h-[22px] items-center rounded-full bg-[#f1f1f1] px-2 text-xs text-[#999]"
                >
                  {SOCIAL_PROVIDER_LABEL[provider]} 연결 안 됨
                </span>
              ),
            )}
            <InfoNote>카카오·네이버로 처음 로그인하면 이 계정에 연결됩니다</InfoNote>
          </InfoRow>
          <div className={cn(marketingMessage && "[&>div]:border-b-0")}>
            <InfoRow label="마케팅 정보 수신">
              <MarketingSwitch
                checked={Boolean(me.marketingAgreed)}
                disabled={savingMarketing}
                onChange={handleMarketing}
              />
              <InfoNote>새 제품·할인 소식을 받습니다 (선택)</InfoNote>
            </InfoRow>
            {marketingMessage && (
              <RowMessage tone={marketingMessage.tone}>{marketingMessage.text}</RowMessage>
            )}
          </div>
          <InfoRow label="가입일">{me.createdAt && formatDate(me.createdAt)}</InfoRow>
        </dl>
      </section>

      {me.hasPassword && (
        <section className="mt-11">
          <h3 className="mb-3 text-lg font-bold">{passwordOpen ? "비밀번호 변경" : "비밀번호"}</h3>
          {passwordOpen ? (
            renderPasswordChange(() => setPasswordOpen(false))
          ) : (
            <dl className="border-t-2 border-black">
              <InfoRow label="비밀번호">
                <InfoNote>바꾸면 다른 기기는 로그아웃됩니다</InfoNote>
                <button
                  type="button"
                  className={ROW_BUTTON_CLASS}
                  onClick={() => setPasswordOpen(true)}
                >
                  비밀번호 변경
                </button>
              </InfoRow>
            </dl>
          )}
        </section>
      )}
    </>
  );
}

// 표 줄 바로 아래 한 줄 (그 줄의 결과·오류). 고치거나 다시 할 때까지 남는다
function RowMessage({ tone, children }: { tone: "ok" | "error"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "border-b border-[#ebebeb] px-1 pb-2.5 text-xs sm:pl-[154px]",
        tone === "error" ? "text-store-danger" : "text-[#555]",
      )}
    >
      {children}
    </p>
  );
}
