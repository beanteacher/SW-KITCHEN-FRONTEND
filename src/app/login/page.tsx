import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth";

// 쇼핑몰 머리글 없이 따로 뜨는 화면. 회색 바탕 가운데에 600px 흰 칸 (무신사 로그인과 같은 틀)
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto flex min-h-screen w-full max-w-[600px] flex-col bg-white">
        <header className="flex h-[52px] items-center bg-[#f5f5f5] px-4">
          <h1 className="text-base font-medium">로그인</h1>
        </header>
        <main className="px-4 pt-[50px]">
          <Link
            href="/"
            className="mx-auto mb-10 block w-fit text-xl leading-6 font-extrabold tracking-[-0.5px]"
          >
            성원종합주방
          </Link>
          {/* 로그인 뒤 돌아갈 주소(redirect)를 주소창에서 읽으므로 그 부분만 기다린다 */}
          <Suspense>
            <LoginForm />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
