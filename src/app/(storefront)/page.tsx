import { redirect } from "next/navigation";

// 첫 화면은 아직 없어서 신제품 목록으로 보낸다
export default function HomePage() {
  redirect("/product/new");
}
