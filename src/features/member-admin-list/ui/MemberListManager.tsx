"use client";

import type { FormEvent, ReactNode } from "react";
import { SOCIAL_PROVIDER_LABEL, SocialBadge, useAdminMembers } from "@/entities/member";
import { formatDate, formatNumber } from "@/shared/lib";
import { Pagination } from "@/shared/ui";
import { AdminButton, AdminInput, AdminTable, AdminTd, AdminTh } from "@/shared/ui/admin";
import { useMemberListSearchParams } from "../model/useMemberListSearchParams";

const PAGE_SIZE = 20;

// 회원 목록: 검색어 한 줄 + 표 + 페이지 번호. 보기만 하고 고치는 버튼은 없다
export default function MemberListManager() {
  const { filters, hrefWith, search, reset } = useMemberListSearchParams();
  const { data, isPending, isError, refetch } = useAdminMembers({
    keyword: filters.keyword || undefined,
    page: filters.page,
    size: PAGE_SIZE,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search(String(new FormData(event.currentTarget).get("keyword") ?? ""));
  };

  const renderRows = () => {
    if (isError) {
      return (
        <EmptyRow>
          목록을 불러오지 못했습니다.{" "}
          <AdminButton variant="outline" size="compact" onClick={() => refetch()}>
            다시 시도
          </AdminButton>
        </EmptyRow>
      );
    }
    if (isPending) return <EmptyRow>불러오는 중…</EmptyRow>;
    if (data.content.length === 0) return <EmptyRow>찾는 회원이 없습니다.</EmptyRow>;

    // 번호는 전체 가입자 중 순서다. 최신 가입이 가장 큰 번호
    const first = data.totalElements - (data.page - 1) * data.size;
    return data.content.map((member, index) => {
      const [joinedWith] = member.linkedProviders ?? [];
      return (
        <tr key={member.id}>
          <AdminTd>{formatNumber(first - index)}</AdminTd>
          <AdminTd className="text-left">
            {member.userId ?? (
              <span className="text-admin-muted">
                {joinedWith ? `${SOCIAL_PROVIDER_LABEL[joinedWith]}로 가입` : "—"}
              </span>
            )}
          </AdminTd>
          <AdminTd>{member.name}</AdminTd>
          <AdminTd>
            {member.linkedProviders?.length ? (
              <span className="inline-flex gap-1">
                {member.linkedProviders.map((provider) => (
                  <SocialBadge key={provider} provider={provider} variant="admin" />
                ))}
              </span>
            ) : (
              "—"
            )}
          </AdminTd>
          <AdminTd>{member.createdAt && formatDate(member.createdAt)}</AdminTd>
        </tr>
      );
    });
  };

  return (
    <>
      <form role="search" aria-label="회원 검색" noValidate onSubmit={handleSubmit}>
        <AdminTable>
          <table className="w-full border-collapse text-[13px]">
            <tbody>
              <tr>
                <th
                  scope="row"
                  className="w-[140px] bg-admin-fill px-4 py-2 font-semibold text-admin-text"
                >
                  검색어
                </th>
                <td className="px-3 py-2">
                  {/* 초기화·뒤로 가기로 주소가 바뀌면 칸도 주소 값으로 다시 채운다 */}
                  <AdminInput
                    key={filters.keyword}
                    name="keyword"
                    defaultValue={filters.keyword}
                    maxLength={20}
                    placeholder="아이디, 이름"
                    aria-label="검색어"
                    className="max-w-[420px]"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </AdminTable>
        <div className="mt-3.5 mb-6 flex justify-center gap-1.5">
          <AdminButton type="submit" className="h-9 min-w-[90px]">
            검색
          </AdminButton>
          <AdminButton variant="outline" className="h-9 min-w-[90px]" onClick={reset}>
            초기화
          </AdminButton>
        </div>
      </form>

      <p className="mb-2">
        검색 <b className="text-admin-error">{formatNumber(data?.totalElements ?? 0)}</b>명
      </p>
      <AdminTable>
        <table className="w-full table-fixed border-collapse text-[13px]">
          <colgroup>
            <col className="w-20" />
            <col />
            <col className="w-40" />
            <col className="w-[200px]" />
            <col className="w-[140px]" />
          </colgroup>
          <thead>
            <tr>
              <AdminTh>번호</AdminTh>
              <AdminTh>아이디</AdminTh>
              <AdminTh>이름</AdminTh>
              <AdminTh>연결된 계정</AdminTh>
              <AdminTh>가입일</AdminTh>
            </tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </table>
      </AdminTable>
      {data && (
        <div className="mt-5">
          <Pagination
            page={filters.page}
            totalPages={data.totalPages}
            size="sm"
            getHref={(page) => hrefWith({ page })}
          />
        </div>
      )}
    </>
  );
}

function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <tr>
      <td colSpan={5} role="status" className="py-16 text-center text-admin-sub">
        {children}
      </td>
    </tr>
  );
}
