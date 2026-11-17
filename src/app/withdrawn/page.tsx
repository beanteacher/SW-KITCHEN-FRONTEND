import type { Metadata } from "next";
import Link from "next/link";
import { StandalonePage, StandaloneResult, standaloneButtonClass } from "@/shared/ui";

// 개인정보가 없는 안내 화면이라 검색 엔진에는 담지 않는다
export const metadata: Metadata = { robots: { index: false } };

// 탈퇴 완료. 되돌릴 수 없는 일이 끝났으므로 사라지는 알림 대신 화면으로 알린다
export default function WithdrawnPage() {
  return (
    <StandalonePage title="회원 탈퇴">
      <StandaloneResult
        title="탈퇴했습니다"
        actions={
          <Link href="/" className={standaloneButtonClass()}>
            쇼핑몰로 가기
          </Link>
        }
      >
        그동안 성원종합주방을 이용해 주셔서 감사합니다.
        <br />
        법으로 보관해야 하는 주문 기록은 정해진 기간 동안 따로 보관한 뒤 지웁니다.
        <br />
        다시 가입하시면 새 계정으로 시작합니다.
      </StandaloneResult>
    </StandalonePage>
  );
}
