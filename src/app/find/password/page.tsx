import { Suspense } from "react";
import { ResetPasswordFlow } from "@/features/find-account";
import { FreshPage } from "@/shared/ui";

export default function ResetPasswordPage() {
  return (
    // 아이디 찾기에서 넘어온 아이디(?userId=)를 주소창에서 읽으므로 기다린다
    <Suspense>
      <FreshPage>
        <ResetPasswordFlow />
      </FreshPage>
    </Suspense>
  );
}
