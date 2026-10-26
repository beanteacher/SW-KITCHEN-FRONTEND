import type { CategoryDto } from "@/entities/category";
import { apiRequest } from "@/shared/api";

export * as CategoryAdminApi from "./categoryAdminApi";

const BASE_URL = "admin/category";

export const create = (data: CategoryDto.CreateForm) =>
  apiRequest<CategoryDto.Response>(BASE_URL, { method: "post", json: data });

export const edit = (id: number, data: CategoryDto.EditForm) =>
  apiRequest<CategoryDto.Response>(`${BASE_URL}/${id}`, { method: "patch", json: data });

export const changeOrder = (data: CategoryDto.ChangeOrderForm) =>
  apiRequest<void>(`${BASE_URL}/order`, { method: "put", json: data });

export const remove = (id: number) => apiRequest<void>(`${BASE_URL}/${id}`, { method: "delete" });
