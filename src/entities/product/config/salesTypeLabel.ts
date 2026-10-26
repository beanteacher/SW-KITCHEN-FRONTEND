import type { ProductDto } from "../model/dto/productDto";

export const SALES_TYPE_LABEL: Record<ProductDto.SalesType, string> = {
  NEW: "신제품",
  STOCK: "재고품",
  USED: "중고품",
};
