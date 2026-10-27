import { z } from "zod";

export * as ProductSchema from "./productSchema";

// 서버와 같은 입력 상한. 숫자 칸은 화면에서 쉼표를 보여 주려고 숫자만 든 글자로 들고 있다
const MAX_OPTIONS = 99;
const MAX_SPECS = 30;

const imageSchema = z.object({ key: z.string(), url: z.string().optional() });

const specSchema = z.object({
  name: z.string().trim().min(1, "항목을 입력해 주세요.").max(30, "항목은 30자 이하입니다."),
  value: z.string().trim().min(1, "내용을 입력해 주세요.").max(100, "내용은 100자 이하입니다."),
});

// 옵션 한 줄. 지울 옵션(removed)은 검사하지 않으므로 칸 검사는 아래 superRefine 에서 한다
const optionSchema = z.object({
  // 저장된 옵션만 있다
  id: z.number().optional(),
  version: z.number().optional(),
  productCode: z.string().optional(),
  reservedQty: z.number(),
  // 저장된 옵션을 [×] 로 지우면 줄은 남기고 표시만 한다. 실제 삭제는 저장 때
  removed: z.boolean(),
  modelName: z.string(),
  widthMm: z.string(),
  depthMm: z.string(),
  heightMm: z.string(),
  listPrice: z.string(),
  discountType: z.enum(["NONE", "RATE", "AMOUNT"]),
  discountValue: z.string(),
  stockQty: z.string(),
  mainImage: imageSchema.nullable(),
  images: z.array(imageSchema).max(10, "옵션 추가 이미지는 10장까지입니다."),
});

export const ProductFormSchema = z
  .object({
    categoryId: z.number().nullable(),
    name: z
      .string()
      .trim()
      .min(1, "제품명을 입력해 주세요.")
      .max(100, "제품명은 100자 이하입니다."),
    salesType: z.enum(["NEW", "STOCK", "USED"]).nullable(),
    manufacturer: z
      .string()
      .trim()
      .min(1, "제조사를 입력해 주세요.")
      .max(50, "제조사는 50자 이하입니다."),
    origin: z
      .string()
      .trim()
      .min(1, "원산지를 입력해 주세요.")
      .max(30, "원산지는 30자 이하입니다."),
    description: z.string().max(5_000, "설명은 5,000자 이하입니다."),
    materials: z.array(z.enum(["STAINLESS", "ALUMINUM", "STEEL", "PLASTIC"])),
    specs: z.array(specSchema).max(MAX_SPECS, "상품 상세정보는 30줄까지입니다."),
    images: z.array(imageSchema).max(10, "추가 이미지는 10장까지입니다."),
    detailImages: z.array(imageSchema).max(20, "상세 이미지는 20장까지입니다."),
    options: z.array(optionSchema),
  })
  .superRefine((values, ctx) => {
    if (values.categoryId === null) {
      ctx.addIssue({ code: "custom", path: ["categoryId"], message: "분류를 골라 주세요." });
    }
    if (values.salesType === null) {
      ctx.addIssue({ code: "custom", path: ["salesType"], message: "판매 구분을 골라 주세요." });
    }

    // 상품 상세정보 항목은 겹치면 안 된다. 뒤에 나온 줄에 오류를 붙인다 (앞뒤 공백은 빼고 비교)
    const specNames = new Set<string>();
    values.specs.forEach((spec, index) => {
      const name = spec.name.trim();
      if (!name) return;
      if (specNames.has(name)) {
        ctx.addIssue({
          code: "custom",
          path: ["specs", index, "name"],
          message: "같은 항목이 이미 있습니다",
        });
      }
      specNames.add(name);
    });

    const active = values.options.filter((option) => !option.removed);
    if (active.length === 0) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "옵션을 1개 이상 넣어 주세요." });
    }
    if (active.length > MAX_OPTIONS) {
      ctx.addIssue({ code: "custom", path: ["options"], message: "옵션은 99개까지입니다." });
    }

    // 치수(가로·깊이·높이)가 같은 옵션은 둘 수 없다. 뒤에 나온 줄의 가로 칸에 앞 줄 번호를 알려 준다
    const sizes = new Map<string, number>();
    values.options.forEach((option, index) => {
      if (option.removed) return;
      for (const issue of getOptionIssues(option, values.salesType)) {
        ctx.addIssue({
          code: "custom",
          path: ["options", index, issue.field],
          message: issue.message,
        });
      }
      const { widthMm, depthMm, heightMm } = option;
      if (!widthMm || !depthMm || !heightMm) return;
      const size = `${Number(widthMm)}x${Number(depthMm)}x${Number(heightMm)}`;
      const first = sizes.get(size);
      if (first !== undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["options", index, "widthMm"],
          message: `${first + 1}번과 치수가 같습니다`,
        });
        return;
      }
      sizes.set(size, index);
    });
  });

export type FormValues = z.infer<typeof ProductFormSchema>;
export type OptionValues = z.infer<typeof optionSchema>;
export type ImageValue = z.infer<typeof imageSchema>;

type OptionField = keyof OptionValues;

// 숫자 칸 검사. 비었으면 requiredMessage, 숫자가 아니거나 범위 밖이면 rangeMessage
function checkNumber(
  text: string,
  min: number,
  max: number,
  requiredMessage: string,
  rangeMessage: string,
) {
  if (!text) return requiredMessage;
  if (!/^\d+$/.test(text)) return rangeMessage;
  const value = Number(text);
  return value < min || value > max ? rangeMessage : null;
}

// 옵션 한 줄의 칸 오류. 판매 구분에 따라 재고 칸이 있고 없다
function getOptionIssues(option: OptionValues, salesType: FormValues["salesType"]) {
  const issues: { field: OptionField; message: string }[] = [];
  const add = (field: OptionField, message: string | null) => {
    if (message) issues.push({ field, message });
  };

  if (option.modelName.trim().length > 50) add("modelName", "모델명은 50자 이하입니다.");
  add(
    "widthMm",
    checkNumber(option.widthMm, 1, 20_000, "가로를 입력해 주세요.", "가로는 1~20,000mm 입니다."),
  );
  add(
    "depthMm",
    checkNumber(option.depthMm, 1, 20_000, "깊이를 입력해 주세요.", "깊이는 1~20,000mm 입니다."),
  );
  add(
    "heightMm",
    checkNumber(option.heightMm, 1, 20_000, "높이를 입력해 주세요.", "높이는 1~20,000mm 입니다."),
  );
  const listPriceError = checkNumber(
    option.listPrice,
    1,
    999_999_999,
    "정상가를 입력해 주세요.",
    "정상가는 1~999,999,999원입니다.",
  );
  add("listPrice", listPriceError);

  if (option.discountType === "RATE") {
    add(
      "discountValue",
      checkNumber(option.discountValue, 1, 99, "할인율을 입력해 주세요.", "할인율은 1~99% 입니다."),
    );
  }
  if (option.discountType === "AMOUNT") {
    // 정상가가 틀렸으면 정상가 칸 오류로 충분하다
    const maxAmount = listPriceError ? 999_999_998 : Number(option.listPrice) - 1;
    add(
      "discountValue",
      checkNumber(
        option.discountValue,
        1,
        maxAmount,
        "할인 금액을 입력해 주세요.",
        "할인 금액은 1원 이상, 정상가보다 작아야 합니다.",
      ),
    );
  }

  // 신제품은 재고를 세지 않는다. 재고품·중고품은 재고가 잡아 둔 수량(예약)보다 적을 수 없다
  if (salesType === "STOCK" || salesType === "USED") {
    const stockError = checkNumber(
      option.stockQty,
      0,
      99_999,
      "재고를 입력해 주세요.",
      "재고는 0~99,999개입니다.",
    );
    add("stockQty", stockError);
    if (!stockError && Number(option.stockQty) < option.reservedQty) {
      add("stockQty", `예약 ${option.reservedQty}개 이상`);
    }
  }

  if (!option.mainImage) add("mainImage", "대표 이미지를 올려 주세요.");
  return issues;
}
