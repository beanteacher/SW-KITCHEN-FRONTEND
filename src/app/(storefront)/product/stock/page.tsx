import { Suspense } from "react";
import { ProductListView } from "@/features/product-list";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function StockProductsPage({ searchParams }: Props) {
  return (
    // 조건을 주소에서 읽으므로 목록 부분만 열 때 그린다
    <Suspense>
      <ProductListView screen="stock" searchParams={searchParams} />
    </Suspense>
  );
}
