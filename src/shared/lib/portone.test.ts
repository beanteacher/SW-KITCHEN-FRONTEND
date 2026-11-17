import { describe, expect, it } from "vitest";
import { newIdentityVerificationId } from "./portone";

describe("본인인증 건 번호", () => {
  it("KCP 가 받는 40자 이내 영문·숫자다", () => {
    expect(newIdentityVerificationId()).toMatch(/^[A-Za-z0-9]{1,40}$/);
  });

  it("누를 때마다 다르다", () => {
    expect(newIdentityVerificationId()).not.toBe(newIdentityVerificationId());
  });
});
