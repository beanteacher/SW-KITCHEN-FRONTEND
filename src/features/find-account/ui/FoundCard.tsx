import { SOCIAL_PROVIDER_LABEL, SocialBadge } from "@/entities/member";
import { formatStoreDate } from "@/shared/lib";
import type { FoundAccount } from "../api/findAccountApi";

// 찾은 계정: 아이디 전체(18px 굵게, 가리지 않음) + 연결된 소셜 + 가입일
export default function FoundCard({ account }: { account: FoundAccount }) {
  const [first] = account.linkedProviders ?? [];
  return (
    <div className="rounded-[4px] border border-[#e0e0e0] px-[18px] py-4">
      <div className="flex flex-wrap items-center gap-2">
        {account.userId ? (
          <>
            <b className="text-lg tracking-[-0.2px]">{account.userId}</b>
            {account.linkedProviders?.map((provider) => (
              <SocialBadge key={provider} provider={provider} suffix=" 연결됨" />
            ))}
          </>
        ) : (
          first && <b className="text-base">{SOCIAL_PROVIDER_LABEL[first]}로 가입</b>
        )}
      </div>
      {account.createdAt && (
        <p className="mt-1.5 text-[13px] text-[#888]">{formatStoreDate(account.createdAt)} 가입</p>
      )}
    </div>
  );
}
