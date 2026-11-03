import type { ProductDto } from "@/entities/product";
import { formatNumber } from "@/shared/lib";

// 신제품은 재고를 세지 않아 99개까지 고른다
const NEW_MAX_QTY = 99;

// 재고품·중고품만 품절이 있다. 신제품은 visibleQty 가 null
export function isSoldOut(option: ProductDto.Option) {
  return option.visibleQty === 0;
}

// 처음 고를 옵션: 살 수 있는 첫 옵션. 모두 품절이면 첫 옵션
export function firstBuyableIndex(options: ProductDto.Option[]) {
  return Math.max(
    options.findIndex((option) => !isSoldOut(option)),
    0,
  );
}

export function maxQty(option: ProductDto.Option) {
  return option.visibleQty ?? NEW_MAX_QTY;
}

// 1200×600×800 → "1,200×600×800 mm"
export function formatSize({ widthMm = 0, depthMm = 0, heightMm = 0 }: ProductDto.Option) {
  return `${[widthMm, depthMm, heightMm].map(formatNumber).join("×")} mm`;
}

// 큰 이미지 순서: 고른 옵션의 대표 → 그 옵션의 추가 → 제품 공통
export function galleryImages(product: ProductDto.Detail, option: ProductDto.Option) {
  return [
    ...(option.mainImageUrl ? [option.mainImageUrl] : []),
    ...(option.imageUrls ?? []),
    ...(product.imageUrls ?? []),
  ];
}
