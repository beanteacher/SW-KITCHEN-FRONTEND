import { apiRequest } from "@/shared/api";
import type { CategoryDto } from "../model/dto/categoryDto";

export * as CategoryApi from "./categoryApi";

const ADMIN_BASE_URL = "admin/category";

export const adminTree = () => apiRequest<CategoryDto.AdminTree[]>(ADMIN_BASE_URL);
