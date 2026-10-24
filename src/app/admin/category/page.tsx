import { Suspense } from "react";
import { CategoryManager } from "@/features/category-admin";

export default function AdminCategoriesPage() {
  return (
    // 고른 대분류(?big=)를 주소창에서 읽으므로 그 부분만 기다린다
    <Suspense>
      <CategoryManager />
    </Suspense>
  );
}
