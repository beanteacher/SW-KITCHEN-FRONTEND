"use client";

import { CategoryManager } from "@/features/category-admin";
import { CategoryProductsPanel } from "@/features/product-admin-list";

// 분류 관리 + 분류의 제품 옆 패널. 두 기능은 서로를 모르므로 여기서 잇는다
export default function CategoryAdmin() {
  return (
    <CategoryManager
      renderProductsPanel={(target, onClose) => (
        <CategoryProductsPanel target={target} onClose={onClose} />
      )}
    />
  );
}
