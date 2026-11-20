import { type MemberDto, SocialBadge } from "@/entities/member";
import { formatStoreDate } from "@/shared/lib";

// 이미 있는 계정: 가린 아이디(소셜로만 가입했으면 "카카오로 가입") + 연결된 소셜 + 가입일
export default function AccountChip({ account }: { account: MemberDto.ExistingAccount }) {
  const [first] = account.linkedProviders ?? [];
  return (
    <div className="inline-flex flex-wrap items-center gap-2 rounded-[4px] border border-[#e0e0e0] px-[18px] py-3 text-[15px] font-semibold">
      {account.maskedUserId ?? (first && <SocialBadge provider={first} suffix="로 가입" />)}
      {account.maskedUserId &&
        account.linkedProviders?.map((provider) => (
          <SocialBadge key={provider} provider={provider} suffix=" 연결됨" />
        ))}
      {account.createdAt && (
        <small className="text-xs font-normal text-placeholder">
          {formatStoreDate(account.createdAt)} 가입
        </small>
      )}
    </div>
  );
}
