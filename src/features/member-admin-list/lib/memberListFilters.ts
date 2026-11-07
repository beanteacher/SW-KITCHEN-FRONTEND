export interface MemberListFilters {
  keyword: string;
  page: number;
}

// 주소를 손으로 고쳐 이상한 값이 들어오면 그 조건은 없는 것으로 본다
export function parseMemberListFilters(searchParams: URLSearchParams): MemberListFilters {
  const page = Number(searchParams.get("page"));
  return {
    keyword: searchParams.get("keyword")?.trim() ?? "",
    page: Number.isInteger(page) && page > 1 ? page : 1,
  };
}

// 빈 값과 1페이지는 주소에서 뺀다
export function toMemberListQuery({ keyword, page }: MemberListFilters) {
  const params = new URLSearchParams();
  if (keyword) params.set("keyword", keyword);
  if (page > 1) params.set("page", String(page));
  return params.toString();
}
