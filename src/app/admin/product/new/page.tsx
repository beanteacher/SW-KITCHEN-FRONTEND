import { Suspense } from "react";
import { ProductForm } from "@/features/product-form";

export default function AdminProductNewPage() {
  return (
    // 옵션 줄 key 를 만드는 값(crypto.randomUUID)이 매번 달라서 미리 그려 두지 않고 열 때 그린다
    <Suspense>
      <ProductForm />
    </Suspense>
  );
}
