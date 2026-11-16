import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth";
import { FreshPage, StandalonePage } from "@/shared/ui";

// 쇼핑몰 머리글 없이 따로 뜨는 화면 (무신사 로그인과 같은 틀)
export default function LoginPage() {
  return (
    <StandalonePage title="로그인/회원가입">
      <Link
        href="/"
        className="mx-auto mt-[18px] mb-10 block w-fit text-xl leading-6 font-extrabold tracking-[-0.5px]"
      >
        성원종합주방
      </Link>
      {/* 로그인 뒤 돌아갈 주소(redirect)를 주소창에서 읽으므로 그 부분만 기다린다 */}
      <Suspense>
        <FreshPage>
          <LoginForm />
        </FreshPage>
      </Suspense>
    </StandalonePage>
  );
}
