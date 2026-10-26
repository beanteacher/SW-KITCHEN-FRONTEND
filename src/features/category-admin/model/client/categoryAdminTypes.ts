import type { CategoryDto } from "@/entities/category";

// 관리자 알림 창 하나. confirm 은 [취소] [삭제]
export interface AlertState {
  kind: "warning" | "success" | "confirm";
  title: string;
  message: string;
  onConfirm?: () => void;
}

// 대분류 표·중분류 표가 같이 받는 상태와 처리 함수
export interface CategoryPanelHandlers {
  editingId: number | null;
  isMoving: boolean;
  onEdit: (id: number | null) => void;
  onDelete: (category: CategoryDto.AdminTree) => void;
  onDone: (title: string, message: string) => void;
}

export interface CategoryAdminPageReturn {
  categories: CategoryDto.AdminTree[];
  big: CategoryDto.AdminTree | null;
  isLoading: boolean;
  isError: boolean;
  alert: AlertState | null;
  panelHandlers: CategoryPanelHandlers;
  handleRetry: () => void;
  handleSelectBig: (id: number) => void;
  handleMove: (
    siblings: CategoryDto.AdminTree[],
    parentId: number | null,
  ) => (id: number, direction: -1 | 1) => void;
  handleCloseAlert: () => void;
}
