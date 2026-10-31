// 올리기 전에 화면에서 거르는 이미지. 서버도 파일 내용으로 다시 본다
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 10 * 1024 * 1024;

// 고른 파일 중 올릴 것과 뺀 이유. room 은 더 넣을 수 있는 장수
export function pickImageFiles(files: File[], room: number) {
  const problems: string[] = [];
  const over = files.length - room;
  if (over > 0) problems.push(`${room}장만 더 넣을 수 있어 ${over}장은 빼고 올렸습니다.`);

  const accepted = files.slice(0, Math.max(room, 0)).filter((file) => {
    if (!IMAGE_TYPES.includes(file.type)) {
      problems.push(`${file.name}: JPG·PNG·WEBP 만 올릴 수 있습니다.`);
      return false;
    }
    if (file.size > MAX_BYTES) {
      problems.push(`${file.name}: 10MB 이하만 올릴 수 있습니다.`);
      return false;
    }
    return true;
  });
  return { accepted, problems };
}
