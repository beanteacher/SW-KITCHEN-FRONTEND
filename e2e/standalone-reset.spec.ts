import { expect, login, test } from "./fixtures";

// Next 는 방금 본 화면을 숨겨 두었다 다시 보여 준다. 가입·찾기·로그인·비밀번호 변경·제품 등록은 다른 화면에 다녀오면 처음부터 다시 시작해야 한다

test("가입: 약관을 고른 뒤 로그인 화면에 다녀오면 약관 동의가 풀려 있다", async ({ page }) => {
  await page.goto("/signup");
  await page.getByText("약관 전체 동의하기").click();
  await expect(page.getByRole("checkbox").first()).toBeChecked();

  await page.getByRole("link", { name: "이전" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole("link", { name: "아이디로 가입하기" }).click();

  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("checkbox").first()).not.toBeChecked();
});

test("비밀번호 재설정: 아이디를 넣은 뒤 아이디 찾기 탭에 다녀오면 아이디 칸이 비어 있다", async ({
  page,
}) => {
  await page.goto("/find/password");
  await page.getByLabel("비밀번호를 찾으려는 아이디").fill("someone");

  await page.getByRole("link", { name: "아이디 찾기" }).first().click();
  await expect(page).toHaveURL(/\/find\/id$/);
  await page.getByRole("link", { name: "비밀번호 재설정" }).click();

  await expect(page).toHaveURL(/\/find\/password$/);
  await expect(page.getByLabel("비밀번호를 찾으려는 아이디")).toHaveValue("");
});

test("로그인: 비밀번호를 넣은 뒤 아이디 찾기에 다녀오면 칸이 비어 있다", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("비밀번호", { exact: true }).fill("typed-password");

  await page.getByRole("link", { name: "아이디 찾기" }).click();
  await expect(page).toHaveURL(/\/find\/id$/);
  await page.getByRole("link", { name: "이전" }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel("비밀번호", { exact: true })).toHaveValue("");
});

test("백오피스 비밀번호 변경: 넣던 비밀번호는 다른 메뉴에 다녀오면 비어 있다", async ({ page }) => {
  await login(page);
  await page.getByRole("link", { name: "비밀번호 변경" }).click();
  await page.getByLabel("현재 비밀번호").fill("typed-password");

  await page.getByRole("link", { name: "제품 관리" }).click();
  await page.getByRole("link", { name: "비밀번호 변경" }).click();

  await expect(page.getByLabel("현재 비밀번호")).toHaveValue("");
});

test("제품 등록: 쓰던 제품명은 목록에 다녀와 다시 등록을 누르면 비어 있다", async ({ page }) => {
  await login(page);
  await page.getByRole("link", { name: "제품 관리" }).click();
  await page.getByRole("link", { name: "+ 제품 등록" }).click();
  await page.getByLabel("제품명").fill("남으면 안 되는 제품명");

  await page.getByRole("link", { name: "제품 관리" }).click();
  await page.getByRole("link", { name: "+ 제품 등록" }).click();

  await expect(page.getByLabel("제품명")).toHaveValue("");
});
