import { apiRequest } from "@/shared/api";
import type {
  Category,
  ChangeCategoryOrderRequest,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../model/types";

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
