import { describe, expect, it } from "vitest";
import { pickImageFiles } from "./imageFiles";

const file = (name: string, type: string, size = 1) =>
  new File([new Uint8Array(size)], name, { type });

describe("pickImageFiles", () => {
  it("JPG·PNG·WEBP 는 올린다", () => {
    const files = [
      file("a.jpg", "image/jpeg"),
      file("b.png", "image/png"),
      file("c.webp", "image/webp"),
    ];

    const { accepted, problems } = pickImageFiles(files, 10);

    expect(accepted).toHaveLength(3);
    expect(problems).toEqual([]);
  });

  it("다른 형식과 10MB 넘는 파일은 빼고 이유를 남긴다", () => {
    const files = [file("a.gif", "image/gif"), file("b.jpg", "image/jpeg", 10 * 1024 * 1024 + 1)];

    const { accepted, problems } = pickImageFiles(files, 10);

    expect(accepted).toEqual([]);
    expect(problems).toEqual([
      "a.gif: JPG·PNG·WEBP 만 올릴 수 있습니다.",
      "b.jpg: 10MB 이하만 올릴 수 있습니다.",
    ]);
  });

  it("남은 장수를 넘게 고르면 넘는 만큼 뒤에서 뺀다", () => {
    const files = [
      file("a.jpg", "image/jpeg"),
      file("b.jpg", "image/jpeg"),
      file("c.jpg", "image/jpeg"),
    ];

    const { accepted, problems } = pickImageFiles(files, 2);

    expect(accepted.map((item) => item.name)).toEqual(["a.jpg", "b.jpg"]);
    expect(problems).toEqual(["2장만 더 넣을 수 있어 1장은 빼고 올렸습니다."]);
  });
});
