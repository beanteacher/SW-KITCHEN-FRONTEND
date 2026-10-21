import { describe, expect, it } from "vitest";
import { getPageWindow } from "./pagination";

describe("페이지 번호 묶음", () => {
  it("현재 페이지가 들어 있는 7개 묶음을 돌려준다", () => {
    expect(getPageWindow(1, 20)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(getPageWindow(9, 20)).toEqual([8, 9, 10, 11, 12, 13, 14]);
  });

  it("마지막 묶음은 전체 페이지 수에서 끝난다", () => {
    expect(getPageWindow(16, 17)).toEqual([15, 16, 17]);
  });

  it("범위를 벗어난 페이지는 가장 가까운 끝으로 맞춘다", () => {
    expect(getPageWindow(99, 3)).toEqual([1, 2, 3]);
    expect(getPageWindow(0, 3)).toEqual([1, 2, 3]);
  });

  it("페이지가 없으면 빈 목록을 돌려준다", () => {
    expect(getPageWindow(1, 0)).toEqual([]);
  });
});
