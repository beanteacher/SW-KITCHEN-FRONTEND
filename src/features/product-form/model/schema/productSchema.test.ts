import { describe, expect, it } from "vitest";
import { emptyOption, toFormValues } from "../../lib/productFormValues";
import { ProductSchema, type FormValues, type OptionValues } from "./productSchema";

const image = { key: "products/00000000-0000-0000-0000-000000000000.jpg" };

function option(overrides: Partial<OptionValues> = {}): OptionValues {
  return {
    ...emptyOption(),
    widthMm: "1260",
    depthMm: "800",
    heightMm: "1900",
    listPrice: "2000000",
    stockQty: "5",
    mainImage: image,
    ...overrides,
  };
}

function valid(overrides: Partial<FormValues> = {}): FormValues {
  return {
    ...toFormValues(),
    categoryId: 12,
    name: "업소용 냉장고",
    salesType: "STOCK",
    manufacturer: "우성",
    origin: "국산",
    options: [option()],
    ...overrides,
  };
}

// 오류를 "칸 경로: 문구" 로 모아 본다
function issues(values: FormValues) {
  const result = ProductSchema.ProductFormSchema.safeParse(values);
  return result.error?.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`) ?? [];
}

describe("제품 입력 검사", () => {
  it("필수 칸을 채운 제품은 통과한다", () => {
    expect(issues(valid())).toEqual([]);
  });

  it("빈 폼은 필수 칸마다 문구를 준다", () => {
    expect(issues(toFormValues())).toEqual([
      "name: 제품명을 입력해 주세요.",
      "manufacturer: 제조사를 입력해 주세요.",
      "origin: 원산지를 입력해 주세요.",
      "categoryId: 분류를 골라 주세요.",
      "salesType: 판매 구분을 골라 주세요.",
      "options.0.widthMm: 가로를 입력해 주세요.",
      "options.0.depthMm: 깊이를 입력해 주세요.",
      "options.0.heightMm: 높이를 입력해 주세요.",
      "options.0.listPrice: 정상가를 입력해 주세요.",
      "options.0.mainImage: 대표 이미지를 올려 주세요.",
    ]);
  });

  it("할인: 정률은 1~99, 정액은 정상가보다 작아야 한다", () => {
    expect(
      issues(valid({ options: [option({ discountType: "RATE", discountValue: "100" })] })),
    ).toEqual(["options.0.discountValue: 할인율은 1~99% 입니다."]);
    expect(
      issues(valid({ options: [option({ discountType: "AMOUNT", discountValue: "2000000" })] })),
    ).toEqual(["options.0.discountValue: 할인 금액은 1원 이상, 정상가보다 작아야 합니다."]);
  });

  it("치수가 같은 옵션은 뒤 줄 가로 칸에 앞 줄 번호를 알려 준다", () => {
    expect(issues(valid({ options: [option(), option({ widthMm: "1500" }), option()] }))).toEqual([
      "options.2.widthMm: 1번과 치수가 같습니다",
    ]);
  });

  it("상품 상세정보 항목이 겹치면 뒤 줄에 알려 준다 (앞뒤 공백은 빼고 비교)", () => {
    const specs = [
      { name: "소비전력", value: "1300W" },
      { name: " 소비전력 ", value: "1500W" },
    ];
    expect(issues(valid({ specs }))).toEqual(["specs.1.name: 같은 항목이 이미 있습니다"]);
  });

  it("재고품은 재고가 필수이고, 예약보다 적을 수 없다. 신제품은 재고를 보지 않는다", () => {
    expect(issues(valid({ options: [option({ stockQty: "" })] }))).toEqual([
      "options.0.stockQty: 재고를 입력해 주세요.",
    ]);
    expect(issues(valid({ options: [option({ stockQty: "1", reservedQty: 2 })] }))).toEqual([
      "options.0.stockQty: 예약 2개 이상",
    ]);
    expect(issues(valid({ salesType: "NEW", options: [option({ stockQty: "" })] }))).toEqual([]);
  });

  it("지울 옵션은 검사하지 않고, 남은 옵션이 없으면 1개 이상 넣으라고 한다", () => {
    const removed = option({ id: 1, removed: true, widthMm: "" });
    expect(issues(valid({ options: [removed, option()] }))).toEqual([]);
    expect(issues(valid({ options: [removed] }))).toEqual([
      "options: 옵션을 1개 이상 넣어 주세요.",
    ]);
  });
});
