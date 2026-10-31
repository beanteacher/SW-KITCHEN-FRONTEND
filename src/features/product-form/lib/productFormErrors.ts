// 서버가 돌려준 칸 경로를 폼 칸 경로로 바꾼다
// - 보낸 옵션 배열은 지울 옵션을 뺀 것이라, 옵션 번호는 optionIndexes 로 폼의 줄 번호로 되돌린다
// - 서버는 이미지를 키(…Key, …Keys)로 받고 폼은 이미지(키+주소)로 들고 있어 이름이 다르다
// 예: "options[1].mainImageKey" → "options.2.mainImage" (폼 2번 줄이 보낸 1번째일 때)
export function toProductFormPath(serverField: string, optionIndexes: number[]) {
  return serverField
    .replace(
      /^options\[(\d+)\]/,
      (_, sent: string) => `options.${optionIndexes[Number(sent)] ?? sent}`,
    )
    .replace(/\[(\d+)\]/g, ".$1")
    .replace(/(^|\.)detailImageKeys\b/, "$1detailImages")
    .replace(/(^|\.)imageKeys\b/, "$1images")
    .replace(/(^|\.)mainImageKey\b/, "$1mainImage");
}

// 폼 오류가 몇 곳인지. react-hook-form 오류 묶음에서 message 가 있는 자리를 센다 (ref 는 입력칸이라 건너뛴다)
export function countFieldErrors(errors: unknown): number {
  if (!errors || typeof errors !== "object") return 0;
  const own = "message" in errors && typeof errors.message === "string" ? 1 : 0;
  return Object.entries(errors).reduce(
    (count, [key, value]) =>
      key === "ref" || key === "message" ? count : count + countFieldErrors(value),
    own,
  );
}
