"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdminProduct } from "@/entities/product";
import { ApiError } from "@/shared/api";
import { ErrorView, StatusView } from "@/shared/ui";
import { AdminPageHeader, adminButtonClass } from "@/shared/ui/admin";
import ProductForm from "./ProductForm";

// 수정 화면: 주소의 제품을 받아 온 뒤 폼을 채운다
export default function ProductEditForm() {
  // 주소의 id. 숫자가 아니면 없는 제품으로 본다
  const id = Number(useParams<{ id: string }>().id);
  const validId = Number.isInteger(id) && id > 0;
  const { data, error, isPending, refetch } = useAdminProduct(validId ? id : null);

  const notFound = !validId || (error instanceof ApiError && error.status === 404);
  if (notFound) {
    return (
      <StatusView
        message="찾는 제품이 없습니다."
        action={
          <Link href="/admin/product" className={adminButtonClass({ variant: "outline" })}>
            제품 목록으로
          </Link>
        }
      />
    );
  }

  if (error) {
    return (
      <ErrorView message="제품을 불러오지 못했습니다." onRetry={() => refetch()} variant="admin" />
    );
  }

  if (isPending) {
    return (
      <>
        <AdminPageHeader title="제품 수정" sub={`#${id}`} tight />
        <StatusView message="불러오는 중…" />
      </>
    );
  }

  return <ProductForm product={data} />;
}
