import { notFound } from "next/navigation";

// 바로 404 를 던지는 화면이라 미리 그려 둘 것이 없다. Next 의 개발 중 검사(instant)에서 뺀다
export const instant = false;

// 관리 화면 아래의 없는 주소를 관리 틀 안의 404(admin/not-found)로 보낸다. 이게 없으면 Next 는 맨 바깥 404 를 쓴다
export default function AdminUnknownPage() {
  notFound();
}
