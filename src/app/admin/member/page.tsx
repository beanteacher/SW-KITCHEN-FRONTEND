import { Suspense } from "react";
import { MemberListManager } from "@/features/member-admin-list";
import { AdminPageHeader } from "@/shared/ui/admin";

export default function AdminMembersPage() {
  return (
    <>
      <AdminPageHeader title="회원 목록" />
      {/* 검색어·페이지를 주소창에서 읽으므로 목록 부분만 기다린다 */}
      <Suspense>
        <MemberListManager />
      </Suspense>
    </>
  );
}
