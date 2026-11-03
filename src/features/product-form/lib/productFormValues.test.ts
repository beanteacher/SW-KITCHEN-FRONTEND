import { describe, expect, it } from "vitest";
import type { ProductDto } from "@/entities/product";
import { toFormValues, toSaveForm } from "./productFormValues";

const detail: ProductDto.AdminDetail = {
  id: 77,
  name: "업소용 냉장고",
  salesType: "STOCK",
  category: { id: 12, name: "업소용 냉장고", parent: { id: 1, name: "냉장·냉동" } },
  manufacturer: "우성",
  origin: "국산",
  materials: [{ code: "STAINLESS", name: "스테인리스" }],
  specs: [{ name: "소비전력", value: "1300W" }],
  description: null,
  images: [{ key: "products/a.jpg", url: "https://img/a.jpg" }],
  detailImages: [],
  options: [
    {
      id: 501,
      version: 3,
      productCode: "RFUR-00123-01",
      modelName: null,
      widthMm: 1260,
      depthMm: 800,
      heightMm: 1900,
      listPrice: 2_000_000,
      discountType: "RATE",
      discountValue: 10,
      salePrice: 1_800_000,
      stockQty: 5,
      reservedQty: 2,
      mainImage: { key: "products/m.jpg", url: "https://img/m.jpg" },
      images: [],
    },
  ],
};

describe("폼 값 ↔ 저장 본문", () => {
  it("서버 제품으로 폼을 채우고, 그대로 저장하면 같은 값을 보낸다", () => {
    const { data, optionIndexes } = toSaveForm(toFormValues(detail));

    expect(optionIndexes).toEqual([0]);
    expect(data).toEqual({
      categoryId: 12,
      name: "업소용 냉장고",
      salesType: "STOCK",
      manufacturer: "우성",
      origin: "국산",
      description: null,
      materials: ["STAINLESS"],
      specs: [{ name: "소비전력", value: "1300W" }],
      imageKeys: ["products/a.jpg"],
      detailImageKeys: [],
      options: [
        {
          id: 501,
          version: 3,
          modelName: null,
          widthMm: 1260,
          depthMm: 800,
          heightMm: 1900,
          listPrice: 2_000_000,
          discountType: "RATE",
          discountValue: 10,
          stockQty: 5,
          mainImageKey: "products/m.jpg",
          imageKeys: [],
        },
      ],
    });
  });

  it("지울 옵션은 빼고 보내며, 보낸 옵션이 폼의 몇 번째 줄인지 알려 준다", () => {
    const values = toFormValues(detail);
    values.options = [{ ...values.options[0], removed: true }, values.options[0]];

    const { data, optionIndexes } = toSaveForm(values);

    expect(data.options).toHaveLength(1);
    expect(optionIndexes).toEqual([1]);
  });

  it("신제품은 재고를, 할인 없음은 할인 값을 보내지 않는다", () => {
    const values = toFormValues(detail);
    values.salesType = "NEW";
    values.options[0] = { ...values.options[0], discountType: "NONE" };

    const [sent] = toSaveForm(values).data.options;

    expect(sent.stockQty).toBeNull();
    expect(sent.discountValue).toBeNull();
  });
});
