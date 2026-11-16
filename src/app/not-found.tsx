import Link from "next/link";
import { Suspense } from "react";
import { ProductApi, ProductCard } from "@/entities/product";
import { BackButton, ErrorScreen, errorButtonClass } from "@/shared/ui";
import { StoreFooter } from "@/widgets/store-footer";
import { StoreHeader } from "@/widgets/store-header";

// 없는 주소. 고객이 관리 화면 주소로 들어와도 이 화면이다
export default function NotFound() {
  return (
    <>
      <StoreHeader />
      <main>
        <ErrorScreen
          kind="not-found"
          title="페이지를 찾을 수 없습니다."
          actions={
            <>
              <Link href="/product/new" className={errorButtonClass()}>
                신제품 보러 가기
              </Link>
              <BackButton className={errorButtonClass("line")}>이전 화면으로</BackButton>
            </>
          }
          extra={
            <Suspense>
              <NewProducts />
            </Suspense>
          }
        >
          페이지 주소가 잘못되었거나 알 수 없는 오류가 발생했습니다.
          <br />
          입력한 주소를 다시 확인해 주세요.
        </ErrorScreen>
      </main>
      <StoreFooter />
    </>
  );
}

// 그냥 나가지 않도록 새로 들어온 제품 4개. 못 불러오면 이 칸만 뺀다
async function NewProducts() {
  const products = await ProductApi.list({ scope: "NEW", size: 4 })
    .then((page) => page.content ?? [])
    .catch(() => []);
  if (products.length === 0) return null;

  return (
    <div className="mx-auto mt-10 max-w-[880px] text-left">
      <h2 className="mb-3 text-base font-bold">새로 들어온 제품</h2>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} showSalesType={false} />
          </li>
        ))}
      </ul>
    </div>
  );
}
