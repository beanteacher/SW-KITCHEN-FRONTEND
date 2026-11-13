import { Suspense } from "react";
import { MyPage } from "@/widgets/my-page";

export default function MyPageRoute() {
  return (
    // 탈퇴 전 소셜 로그인에서 돌아온 표시(?withdraw=1)를 주소창에서 읽으므로 기다린다
    <Suspense>
      <MyPage />
    </Suspense>
  );
}
