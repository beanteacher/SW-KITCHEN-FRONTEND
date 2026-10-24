// 추가·수정 응답. 대분류는 parentId 가 null
export interface Category {
  id: number;
  parentId: number | null;
  name: string;
  abbr: string;
  sortOrder: number;
}

export interface CreateCategoryRequest {
  // 없으면 대분류
  parentId: number | null;
  name: string;
  abbr: string;
}

// 보낸 값만 바뀐다. 부모는 바꿀 수 없다
export interface UpdateCategoryRequest {
  name?: string;
  abbr?: string;
}

export interface ChangeCategoryOrderRequest {
  parentId: number | null;
  // 그 부모 아래 형제 분류 전체를 바꿀 순서대로
  categoryIds: number[];
}
