import Link from "next/link";
import { AdminPageHeader, adminButtonClass } from "@/shared/ui/admin";

export default function AdminProductsPage() {
  return (
    <AdminPageHeader
      title="제품 관리"
      action={
        <Link href="/admin/product/new" className={adminButtonClass()}>
          + 제품 등록
        </Link>
      }
    />
  );
}
