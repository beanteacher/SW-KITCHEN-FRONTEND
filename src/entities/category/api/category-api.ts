import { apiRequest } from "@/shared/api";

// 관리 화면 분류 트리. 대분류만 children 을 가지고 중분류는 빈 배열이다
// productCount 는 연결된 제품 수이고, 대분류는 아래 중분류 합이다
export interface AdminCategory {
  id: number;
  name: string;
  abbr: string;
  sortOrder: number;
  productCount: number;
  children: AdminCategory[];
}

// 추가·수정 응답. 대분류는 parentId 가 null
export interface Category {
  id: number;
  parentId: number | null;
  name: string;
  abbr: string;
  sortOrder: number;
}

export const categoryKeys = {
  all: ["category"] as const,
  adminTree: () => [...categoryKeys.all, "admin-tree"] as const,
};

export interface CreateCategoryRequest {
  // 없으면 대분류
  parentId: number | null;
  name: string;
  abbr: string;
}

// 보낸 값만 바뀐다. 부모는 바꿀 수 없다
export interface UpdateCategoryRequest {
  name?: string;
  abbr?: string;
}

export interface ChangeCategoryOrderRequest {
  parentId: number | null;
  // 그 부모 아래 형제 분류 전체를 바꿀 순서대로
  categoryIds: number[];
}

export function getAdminCategories() {
  return apiRequest<AdminCategory[]>("admin/category");
}

export function createCategory(request: CreateCategoryRequest) {
  return apiRequest<Category>("admin/category", { method: "post", json: request });
}

export function updateCategory(id: number, request: UpdateCategoryRequest) {
  return apiRequest<Category>(`admin/category/${id}`, { method: "patch", json: request });
}

export function changeCategoryOrder(request: ChangeCategoryOrderRequest) {
  return apiRequest<void>("admin/category/order", { method: "put", json: request });
}

export function deleteCategory(id: number) {
  return apiRequest<void>(`admin/category/${id}`, { method: "delete" });
}
