const GROUP_SIZE = 7;

// 현재 페이지가 속한 7개 묶음의 페이지 번호들 (1부터 시작)
export function getPageWindow(page: number, totalPages: number) {
  if (totalPages < 1) return [];
  const current = Math.min(Math.max(page, 1), totalPages);
  const start = Math.floor((current - 1) / GROUP_SIZE) * GROUP_SIZE + 1;
  const end = Math.min(start + GROUP_SIZE - 1, totalPages);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
