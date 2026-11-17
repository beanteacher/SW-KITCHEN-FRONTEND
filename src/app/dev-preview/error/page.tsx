import { notFound } from "next/navigation";

// 바로 오류를 던지는 화면이라 미리 그려 둘 것이 없다. Next 의 개발 중 검사(instant)에서 뺀다
export const instant = false;

// ponytail: 쇼핑몰 밖 오류 화면 확인용. 개발 중에만 열리고 운영에서는 없는 주소다
export default function DevErrorPage() {
  if (process.env.NODE_ENV === "production") notFound();
  throw new Error("오류 화면 확인용으로 일부러 낸 오류");
}
