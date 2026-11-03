import Link from "next/link";
import { buttonClass, StatusView } from "@/shared/ui";

export default function ProductNotFound() {
  return (
    <StatusView
      message="찾는 제품이 없습니다"
      action={
        <Link href="/product/new" className={buttonClass()}>
          신제품 보기
        </Link>
      }
    />
  );
}
