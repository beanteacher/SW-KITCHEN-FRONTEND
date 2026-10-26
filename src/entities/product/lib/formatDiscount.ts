import { formatPrice } from "@/shared/lib";
import type { ProductDto } from "../model/dto/productDto";

// 정률은 "10%", 정액은 "-5,000원", 할인 없음은 빈 문자열
export function formatDiscount(type: ProductDto.DiscountType, value: number | null) {
  if (type === "NONE" || value === null) return "";
  if (type === "RATE") return `${value}%`;
  return `-${formatPrice(value)}`;
}
