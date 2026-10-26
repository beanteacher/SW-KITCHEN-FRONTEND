export * as CategoryDto from "./categoryDto";

// 관리 화면 분류 트리 한 줄. 대분류만 children 을 가지고 중분류는 빈 배열이다
// productCount 는 연결된 제품 수이고, 대분류는 아래 중분류 합이다
export interface AdminTree {
  id: number;
  name?: string;
  abbr?: string;
  sortOrder?: number;
  productCount?: number;
  children?: AdminTree[];
}

// 추가·수정 응답. 대분류는 parentId 가 null
export interface Response {
  id: number;
  parentId?: number | null;
  name?: string;
  abbr?: string;
  sortOrder?: number;
}

export interface CreateForm {
  // 없으면 대분류
  parentId: number | null;
  name: string;
  abbr: string;
}

// 보낸 값만 바뀐다. 부모는 바꿀 수 없다
export interface EditForm {
  name?: string;
  abbr?: string;
}

export interface ChangeOrderForm {
  parentId: number | null;
  // 그 부모 아래 형제 분류 전체를 바꿀 순서대로
  categoryIds: number[];
}
