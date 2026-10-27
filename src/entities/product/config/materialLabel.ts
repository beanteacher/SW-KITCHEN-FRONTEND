import type { ProductDto } from "../model/dto/productDto";

// 서버 enum 과 같은 순서·이름. 재질을 더하면 서버 enum·마이그레이션과 함께 바꾼다
export const MATERIAL_LABEL: Record<ProductDto.Material, string> = {
  STAINLESS: "스테인리스",
  ALUMINUM: "알루미늄",
  STEEL: "철",
  PLASTIC: "플라스틱",
};

export const MATERIALS = Object.keys(MATERIAL_LABEL) as ProductDto.Material[];
