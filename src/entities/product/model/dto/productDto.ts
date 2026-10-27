export * as ProductDto from "./productDto";

export type SalesType = "NEW" | "STOCK" | "USED";

export type DiscountType = "NONE" | "RATE" | "AMOUNT";

// 재질 코드는 서버 enum 과 같다. 한글 이름은 config/materialLabel.ts
export type Material = "STAINLESS" | "ALUMINUM" | "STEEL" | "PLASTIC";

// 이미지 키(저장할 때 보낸다)와 보여 줄 주소
export interface Image {
  key: string;
  url?: string;
}

// 중분류와 그 대분류. 대분류는 parent 가 없다
export interface CategoryRef {
  id: number;
  name?: string;
  parent?: CategoryRef | null;
}

export interface MaterialItem {
  code: Material;
  name?: string;
}

// 상품 상세정보 한 줄 (항목 · 내용)
export interface Spec {
  name?: string;
  value?: string;
}

// 수정 화면용 옵션. version 은 저장할 때 그대로 돌려보낸다 (그 사이 다른 사람이 바꿨는지 서버가 본다)
// 신제품은 stockQty 가 null
export interface AdminOption {
  id: number;
  version?: number;
  productCode?: string;
  modelName?: string | null;
  widthMm?: number;
  depthMm?: number;
  heightMm?: number;
  listPrice?: number;
  discountType?: DiscountType;
  discountValue?: number | null;
  salePrice?: number;
  stockQty?: number | null;
  reservedQty?: number;
  mainImage?: Image;
  images?: Image[];
}

// 수정 화면용 제품 전체
export interface AdminDetail {
  id: number;
  name?: string;
  salesType?: SalesType;
  category?: CategoryRef;
  manufacturer?: string;
  origin?: string;
  materials?: MaterialItem[];
  specs?: Spec[];
  description?: string | null;
  images?: Image[];
  detailImages?: Image[];
  options?: AdminOption[];
}

// 등록·수정 때 보내는 옵션. 기존 옵션은 id·version 을 함께 보낸다. 신제품은 stockQty 가 null
export interface OptionForm {
  id?: number;
  version?: number;
  modelName: string | null;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  listPrice: number;
  discountType: DiscountType;
  discountValue: number | null;
  stockQty: number | null;
  mainImageKey: string;
  imageKeys: string[];
}

export interface SpecForm {
  name: string;
  value: string;
}

// 등록·수정 본문. 상품 코드·판매가·잡아 둔 수량은 서버가 만들어 보내지 않는다. 배열 순서가 표시 순서다
export interface SaveForm {
  categoryId: number;
  name: string;
  salesType: SalesType;
  manufacturer: string;
  origin: string;
  description: string | null;
  materials: Material[];
  specs: SpecForm[];
  imageKeys: string[];
  detailImageKeys: string[];
  options: OptionForm[];
}
