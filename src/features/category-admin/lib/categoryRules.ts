import type { CategoryDto } from "@/entities/category";
import { ApiError } from "@/shared/api";

export interface CategoryFieldErrors {
  name?: string;
  abbr?: string;
}

// 약어 칸: 치는 대로 대문자로 바꾸고 영문 외 글자는 지운다
export function normalizeAbbr(input: string) {
  return input
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 2);
}

// 약어는 형제끼리만 겹치면 안 된다. 고치는 중이면 자기 자신은 뺀다. 겹치면 칸에 띄울 문구를 돌려준다
export function getDuplicateAbbrMessage(
  siblings: CategoryDto.AdminTree[],
  abbr: string,
  selfId?: number,
) {
  const duplicate = siblings.find((sibling) => sibling.abbr === abbr && sibling.id !== selfId);
  return duplicate ? `"${duplicate.name}"과 겹침` : null;
}

// 서버가 거부한 이유를 이름·약어 칸 오류로 바꾼다. 칸에 붙일 게 없으면 null
export function getServerFieldErrors(error: unknown): CategoryFieldErrors | null {
  if (!(error instanceof ApiError)) return null;
  // 화면 검사를 지난 뒤 그 사이 다른 담당자가 같은 약어로 먼저 추가했을 때
  if (error.code === "CATEGORY_ABBR_DUPLICATE") {
    return { abbr: "방금 다른 분류가 이 약어로 추가되었습니다" };
  }
  if (error.code === "CATEGORY_ABBR_LOCKED") return { abbr: error.message };

  const errors: CategoryFieldErrors = {};
  error.fieldErrors.forEach(({ field, message }) => {
    if (field === "name" || field === "abbr") errors[field] ??= message;
  });
  return errors.name || errors.abbr ? errors : null;
}

// 상품 코드 앞자리 = 대분류 약어 + 중분류 약어 (예: RF + UR → RFUR)
export function getCodePrefix(parent: CategoryDto.AdminTree, child: CategoryDto.AdminTree) {
  return `${parent.abbr ?? ""}${child.abbr ?? ""}`;
}

// 지울 수 없으면 알림 창에 띄울 이유를, 지울 수 있으면 null 을 돌려준다
export function getDeleteBlockReason(category: CategoryDto.AdminTree) {
  const childCount = category.children?.length ?? 0;
  const productCount = category.productCount ?? 0;
  if (childCount > 0) {
    return `"${category.name}" 아래에 중분류가 ${childCount}개 있어 삭제할 수 없습니다. 중분류를 먼저 삭제해 주세요.`;
  }
  if (productCount > 0) {
    return `"${category.name}"에 제품 ${productCount}개가 연결되어 있어 삭제할 수 없습니다. 제품의 분류를 먼저 바꿔 주세요.`;
  }
  return null;
}

// ▲(-1)·▼(+1) 를 눌렀을 때 형제 분류 전체의 새 순서. 끝에서 더 못 가면 null
export function moveCategory(siblings: CategoryDto.AdminTree[], id: number, direction: -1 | 1) {
  const ids = siblings.map((sibling) => sibling.id);
  const from = ids.indexOf(id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= ids.length) return null;

  [ids[from], ids[to]] = [ids[to], ids[from]];
  return ids;
}
