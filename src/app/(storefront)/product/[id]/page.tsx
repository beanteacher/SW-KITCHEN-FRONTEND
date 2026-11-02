import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductDetailView } from "@/features/product-detail";

interface Props {
  params: Promise<{ id: string }>;
}

async function ProductDetailById({ params }: Props) {
  const id = Number((await params).id);
  // 주소의 id 가 숫자가 아니면 없는 제품이다
  if (!Number.isSafeInteger(id) || id < 1) notFound();

  return <ProductDetailView id={id} />;
}

export default function ProductDetailPage({ params }: Props) {
  return (
    // 주소의 id 로 서버에서 불러오므로 상세 부분만 열 때 그린다
    <Suspense>
      <ProductDetailById params={params} />
    </Suspense>
  );
}
