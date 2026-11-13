import { Suspense } from "react";
import { SignupFlow } from "@/features/signup";

export default function SignupPage() {
  return (
    // 가입 뒤 돌아갈 주소(redirect)를 주소창에서 읽으므로 기다린다
    <Suspense>
      <SignupFlow />
    </Suspense>
  );
}
