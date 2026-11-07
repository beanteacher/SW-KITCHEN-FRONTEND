import { AdminPageHeader } from "@/shared/ui/admin";
import { AdminPasswordChange } from "@/widgets/member-admin";

export default function AdminPasswordPage() {
  return (
    <>
      <AdminPageHeader title="비밀번호 변경" sub="바꾸면 다른 기기는 로그아웃됩니다." />
      <AdminPasswordChange />
    </>
  );
}
