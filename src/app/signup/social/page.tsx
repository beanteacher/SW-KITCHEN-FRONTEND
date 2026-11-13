import { Suspense } from "react";
import { SocialSignupFlow } from "@/features/signup";

export default function SocialSignupPage() {
  return (
    // 어느 소셜로 왔는지(?provider=) 주소창에서 읽으므로 기다린다
    <Suspense>
      <SocialSignupFlow />
    </Suspense>
  );
}
