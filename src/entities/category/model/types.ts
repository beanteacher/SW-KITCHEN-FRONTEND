// 관리 화면 분류 트리. 대분류만 children 을 가지고 중분류는 빈 배열이다
// productCount 는 연결된 제품 수이고, 대분류는 아래 중분류 합이다
export interface AdminCategory {
  id: number;
  name: string;
  abbr: string;
  sortOrder: number;
  productCount: number;
  children: AdminCategory[];
}
