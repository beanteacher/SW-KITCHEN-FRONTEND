export interface ApiResponse<T> {
  success: true;
  data: T;
  message: string | null;
  timestamp: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  code: string;
  message: string;
  errors?: FieldError[];
  timestamp: string;
}

// 페이지 번호는 1부터 시작한다
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
