import { apiRequest } from "@/shared/api";
import type { ProductDto } from "../model/dto/productDto";

export * as ProductApi from "./productApi";

const ADMIN_BASE_URL = "admin/product";

export const adminDetail = (id: number) =>
  apiRequest<ProductDto.AdminDetail>(`${ADMIN_BASE_URL}/${id}`);
