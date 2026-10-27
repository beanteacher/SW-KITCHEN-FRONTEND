import { describe, expect, it } from "vitest";
import { toProductFormPath } from "./productFormErrors";

describe("서버 칸 경로 → 폼 칸 경로", () => {
  it("보낸 옵션 번호를 폼 줄 번호로 되돌린다 (지울 옵션은 보내지 않았다)", () => {
    // 폼 0번 줄은 지울 옵션이라 보낸 0번째는 폼 1번 줄이다
    expect(toProductFormPath("options[0].widthMm", [1, 2])).toBe("options.1.widthMm");
    expect(toProductFormPath("options[1].stockQty", [1, 2])).toBe("options.2.stockQty");
  });

  it("이미지 키 이름을 폼 이미지 이름으로 바꾼다", () => {
    expect(toProductFormPath("options[0].mainImageKey", [0])).toBe("options.0.mainImage");
    expect(toProductFormPath("options[0].imageKeys", [0])).toBe("options.0.images");
    expect(toProductFormPath("imageKeys", [])).toBe("images");
    expect(toProductFormPath("detailImageKeys[3]", [])).toBe("detailImages.3");
  });

  it("그 밖의 칸은 점 경로로만 바꾼다", () => {
    expect(toProductFormPath("specs[1].name", [])).toBe("specs.1.name");
    expect(toProductFormPath("name", [])).toBe("name");
  });
});
