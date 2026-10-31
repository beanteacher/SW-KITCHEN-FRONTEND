import Link from "next/link";
import { Suspense } from "react";
import { ProductListManager } from "@/features/product-admin-list";
import { AdminPageHeader, adminButtonClass } from "@/shared/ui/admin";

export default function AdminProductsPage() {
  return (
    <>
      <AdminPageHeader
        title="제품 관리"
        action={
          <Link href="/admin/product/new" className={adminButtonClass()}>
            + 제품 등록
          </Link>
        }
      />
      {/* 검색 조건을 주소창에서 읽으므로 목록 부분만 기다린다 */}
      <Suspense>
        <ProductListManager />
      </Suspense>
    </>
  );
}
