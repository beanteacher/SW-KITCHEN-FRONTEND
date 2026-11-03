import type { CategoryDto } from "@/entities/category";

// 관리자 알림 창 하나. confirm 은 [취소] [삭제]
export interface AlertState {
  kind: "warning" | "success" | "confirm";
  title: string;
  message: string;
  onConfirm?: () => void;
  // 막힘 창의 [제품 보기]처럼 [확인] 앞에 붙는 버튼
  extraAction?: { label: string; onClick: () => void };
}

// 옆 패널에 제품을 열 분류. 중분류면 대분류 이름을 함께 둔다
export interface ProductsTarget {
  id: number;
  name: string;
  parentName?: string;
}

// 대분류 표·중분류 표가 같이 받는 상태와 처리 함수
export interface CategoryPanelHandlers {
  editingId: number | null;
  isMoving: boolean;
  onEdit: (id: number | null) => void;
  onDelete: (category: CategoryDto.AdminTree) => void;
  // 수량 숫자를 누르면 그 분류의 제품을 옆 패널에 연다. 패널이 없는 화면이면 비어 숫자로만 보인다
  onShowProducts?: (category: CategoryDto.AdminTree) => void;
  onDone: (title: string, message: string) => void;
}

export interface CategoryAdminPageReturn {
  categories: CategoryDto.AdminTree[];
  big: CategoryDto.AdminTree | null;
  isLoading: boolean;
  isError: boolean;
  alert: AlertState | null;
  productsTarget: ProductsTarget | null;
  panelHandlers: CategoryPanelHandlers;
  handleRetry: () => void;
  handleSelectBig: (id: number) => void;
  handleMove: (
    siblings: CategoryDto.AdminTree[],
    parentId: number | null,
  ) => (id: number, direction: -1 | 1) => void;
  handleCloseAlert: () => void;
  handleCloseProducts: () => void;
}
