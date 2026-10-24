import type { AdminCategory } from "@/entities/category";
import { ApiError } from "@/shared/api";
import { categorySchema, type CategoryFormValues } from "../model/category-schema";

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

// 약어는 형제끼리만 겹치면 안 된다. 고치는 중이면 자기 자신은 뺀다
export function findDuplicateAbbr(siblings: AdminCategory[], abbr: string, selfId?: number) {
  return siblings.find((sibling) => sibling.abbr === abbr && sibling.id !== selfId);
}

// 서버에 보내기 전에 같은 검사를 하고 겹치는 약어도 미리 막는다. 약어가 잠겼으면 약어는 보지 않는다
export function validateCategory(
  values: CategoryFormValues,
  siblings: AdminCategory[],
  { selfId, abbrLocked = false }: { selfId?: number; abbrLocked?: boolean } = {},
) {
  const errors: CategoryFieldErrors = {};
  const result = categorySchema.safeParse(values);
  result.error?.issues.forEach((issue) => {
    const field = issue.path[0];
    if (field === "name" || field === "abbr") errors[field] ??= issue.message;
  });
  if (abbrLocked) delete errors.abbr;

  if (!abbrLocked && !errors.abbr) {
    const duplicate = findDuplicateAbbr(siblings, values.abbr, selfId);
    if (duplicate) errors.abbr = `"${duplicate.name}"과 겹침`;
  }
  return errors;
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
export function getCodePrefix(parent: AdminCategory, child: AdminCategory) {
  return `${parent.abbr}${child.abbr}`;
}

// 지울 수 없으면 알림 창에 띄울 이유를, 지울 수 있으면 null 을 돌려준다
export function getDeleteBlockReason(category: AdminCategory) {
  if (category.children.length > 0) {
    return `"${category.name}" 아래에 중분류가 ${category.children.length}개 있어 삭제할 수 없습니다. 중분류를 먼저 삭제해 주세요.`;
  }
  if (category.productCount > 0) {
    return `"${category.name}"에 제품 ${category.productCount}개가 연결되어 있어 삭제할 수 없습니다. 제품의 분류를 먼저 바꿔 주세요.`;
  }
  return null;
}

// ▲(-1)·▼(+1) 를 눌렀을 때 형제 분류 전체의 새 순서. 끝에서 더 못 가면 null
export function moveCategory(siblings: AdminCategory[], id: number, direction: -1 | 1) {
  const ids = siblings.map((sibling) => sibling.id);
  const from = ids.indexOf(id);
  const to = from + direction;
  if (from < 0 || to < 0 || to >= ids.length) return null;

  [ids[from], ids[to]] = [ids[to], ids[from]];
  return ids;
}
