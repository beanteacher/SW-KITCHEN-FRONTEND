import { AdminErrorPage } from "@/widgets/admin-shell";

// 관리 화면 안의 없는 주소. 고객은 틀(StaffOnly)에서 먼저 걸러져 쇼핑몰 404 를 본다
export default function AdminNotFoundPage() {
  return (
    <AdminErrorPage title="페이지를 찾을 수 없습니다.">
      주소가 잘못되었거나 없는 메뉴입니다.
      <br />
      왼쪽 메뉴에서 이동해 주세요.
    </AdminErrorPage>
  );
}
