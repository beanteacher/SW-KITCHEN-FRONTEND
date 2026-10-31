import { Suspense } from "react";
import { ProductEditForm } from "@/features/product-form";

interface Props {
  params: Promise<{ id: string }>;
}

async function EditForm({ params }: Props) {
  const { id } = await params;
  return <ProductEditForm id={Number(id)} />;
}

export default function AdminProductEditPage({ params }: Props) {
  return (
    // 주소의 제품 id 를 읽는 부분만 기다린다
    <Suspense>
      <EditForm params={params} />
    </Suspense>
  );
}
