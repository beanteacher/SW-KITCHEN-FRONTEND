import { describe, expect, it } from "vitest";
import type { ProductDto } from "@/entities/product";
import { firstBuyableIndex, formatSize, galleryImages, isSoldOut, maxQty } from "./productOption";

const option = (id: number, visibleQty: number | null): ProductDto.Option => ({ id, visibleQty });

describe("상세 옵션", () => {
  it("보이는 수량 0 만 품절이고, 신제품(수량 없음)은 품절이 없다", () => {
    expect(isSoldOut(option(1, 0))).toBe(true);
    expect(isSoldOut(option(1, 3))).toBe(false);
    expect(isSoldOut(option(1, null))).toBe(false);
  });

  it("처음에는 살 수 있는 첫 옵션을 고르고, 모두 품절이면 첫 옵션을 고른다", () => {
    expect(firstBuyableIndex([option(1, 0), option(2, 4), option(3, 2)])).toBe(1);
    expect(firstBuyableIndex([option(1, 0), option(2, 0)])).toBe(0);
  });

  it("수량은 보이는 수량까지, 신제품은 99개까지 고른다", () => {
    expect(maxQty(option(1, 3))).toBe(3);
    expect(maxQty(option(1, null))).toBe(99);
  });

  it("사이즈는 천 단위 쉼표를 넣어 가로×깊이×높이 mm 로 보여준다", () => {
    expect(formatSize({ id: 1, widthMm: 1200, depthMm: 600, heightMm: 800 })).toBe(
      "1,200×600×800 mm",
    );
  });

  it("이미지는 고른 옵션의 대표, 그 옵션의 추가, 제품 공통 순서다", () => {
    const product: ProductDto.Detail = { id: 1, imageUrls: ["공통1"] };
    const picked: ProductDto.Option = {
      id: 2,
      mainImageUrl: "대표",
      imageUrls: ["추가1", "추가2"],
    };

    expect(galleryImages(product, picked)).toEqual(["대표", "추가1", "추가2", "공통1"]);
  });
});
