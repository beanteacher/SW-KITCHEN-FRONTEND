import { apiRequest } from "@/shared/api";
import type { CategoryDto } from "../model/dto/categoryDto";

export * as CategoryApi from "./categoryApi";

const BASE_URL = "category";
const ADMIN_BASE_URL = "admin/category";

// 분류 트리 (이름·약어·순서만). 제품 등록 화면의 분류 드롭다운 등
export const tree = () => apiRequest<CategoryDto.Tree[]>(BASE_URL);

// 분류 관리 화면용 트리. 분류마다 제품 수가 붙는다
export const adminTree = () => apiRequest<CategoryDto.AdminTree[]>(ADMIN_BASE_URL);
