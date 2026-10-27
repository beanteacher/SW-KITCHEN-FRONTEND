import type { ProductDto } from "@/entities/product";
import type { FormValues, OptionValues } from "../model/schema/productSchema";

// 숫자를 칸에 넣을 글자로. 없으면 빈칸
const toText = (value: number | null | undefined) =>
  value === null || value === undefined ? "" : String(value);

// [+ 옵션 추가] 로 더하는 빈 줄
export function emptyOption(): OptionValues {
  return {
    reservedQty: 0,
    removed: false,
    modelName: "",
    widthMm: "",
    depthMm: "",
    heightMm: "",
    listPrice: "",
    discountType: "NONE",
    discountValue: "",
    stockQty: "",
    mainImage: null,
    images: [],
  };
}

// 등록 화면은 빈 폼, 수정 화면은 서버에서 받은 제품으로 채운다
export function toFormValues(product?: ProductDto.AdminDetail): FormValues {
  if (!product) {
    return {
      categoryId: null,
      name: "",
      salesType: null,
      manufacturer: "",
      origin: "",
      description: "",
      materials: [],
      specs: [],
      images: [],
      detailImages: [],
      options: [emptyOption()],
    };
  }

  return {
    categoryId: product.category?.id ?? null,
    name: product.name ?? "",
    salesType: product.salesType ?? null,
    manufacturer: product.manufacturer ?? "",
    origin: product.origin ?? "",
    description: product.description ?? "",
    materials: (product.materials ?? []).map((material) => material.code),
    specs: (product.specs ?? []).map((spec) => ({
      name: spec.name ?? "",
      value: spec.value ?? "",
    })),
    images: product.images ?? [],
    detailImages: product.detailImages ?? [],
    options: (product.options ?? []).map((option) => ({
      id: option.id,
      version: option.version,
      productCode: option.productCode,
      reservedQty: option.reservedQty ?? 0,
      removed: false,
      modelName: option.modelName ?? "",
      widthMm: toText(option.widthMm),
      depthMm: toText(option.depthMm),
      heightMm: toText(option.heightMm),
      listPrice: toText(option.listPrice),
      discountType: option.discountType ?? "NONE",
      discountValue: toText(option.discountValue),
      stockQty: toText(option.stockQty),
      mainImage: option.mainImage ?? null,
      images: option.images ?? [],
    })),
  };
}

// 검사를 통과한 폼 값을 저장 본문으로. 지울 옵션은 빼고, 신제품은 재고를 보내지 않는다
// 보낸 옵션이 폼의 몇 번째 줄인지(optionIndexes)를 함께 돌려줘 서버 오류를 그 줄에 붙일 수 있게 한다
export function toSaveForm(values: FormValues) {
  const countsStock = values.salesType === "STOCK" || values.salesType === "USED";
  const optionIndexes: number[] = [];
  const options: ProductDto.OptionForm[] = [];

  values.options.forEach((option, index) => {
    if (option.removed) return;
    optionIndexes.push(index);
    options.push({
      id: option.id,
      version: option.version,
      modelName: option.modelName.trim() || null,
      widthMm: Number(option.widthMm),
      depthMm: Number(option.depthMm),
      heightMm: Number(option.heightMm),
      listPrice: Number(option.listPrice),
      discountType: option.discountType,
      discountValue: option.discountType === "NONE" ? null : Number(option.discountValue),
      stockQty: countsStock ? Number(option.stockQty) : null,
      mainImageKey: option.mainImage?.key ?? "",
      imageKeys: option.images.map((image) => image.key),
    });
  });

  // 검사를 지나면 둘 다 값이 있다. 그래도 비었으면 서버가 칸 오류로 돌려준다
  const data: ProductDto.SaveForm = {
    categoryId: values.categoryId ?? 0,
    name: values.name.trim(),
    salesType: values.salesType ?? "NEW",
    manufacturer: values.manufacturer.trim(),
    origin: values.origin.trim(),
    description: values.description.trim() || null,
    materials: values.materials,
    specs: values.specs.map((spec) => ({ name: spec.name.trim(), value: spec.value.trim() })),
    imageKeys: values.images.map((image) => image.key),
    detailImageKeys: values.detailImages.map((image) => image.key),
    options,
  };
  return { data, optionIndexes };
}
