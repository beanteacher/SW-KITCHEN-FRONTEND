import { expect, login, test } from "./fixtures";

// 실제 서버에 직원 계정을 만들고 정지·비밀번호 변경까지 해 본다. 지울 수 없어서 매번 다른 아이디를 쓴다
const STAFF_ID = `e2e${Date.now().toString(36).slice(-8)}`;

test("회원 목록: 메뉴로 들어가 검색하고, 없으면 안내한다", async ({ page }) => {
  await login(page);
  await page.getByRole("link", { name: "회원 목록" }).click();

  await expect(page.getByRole("heading", { name: "회원 목록" })).toBeVisible();
  await page.getByRole("textbox", { name: "검색어" }).fill("없는회원이름");
  await page.getByRole("button", { name: "검색" }).click();

  await expect(page).toHaveURL(/keyword=/);
  await expect(page.getByText("찾는 회원이 없습니다.")).toBeVisible();
});

test("직원 계정: 추가하면 그 아이디로 로그인되고, 정지하면 로그인되지 않는다", async ({
  page,
  browser,
}) => {
  await login(page);
  await page.getByRole("link", { name: "직원 계정" }).click();
  await page.getByRole("button", { name: "+ 직원 추가" }).click();
  const add = page.getByRole("dialog", { name: "직원 추가" });
  await add.getByLabel("아이디").fill(STAFF_ID);
  await add.getByLabel("이름").fill("시험담당");
  await add.getByLabel("비밀번호", { exact: true }).fill("1");
  await add.getByLabel("비밀번호 확인").fill("1");
  await add.getByRole("button", { name: "추가" }).click();
  await expect(page.getByRole("cell", { name: STAFF_ID })).toBeVisible();

  // 다른 브라우저 창에서 그 직원으로 로그인한다
  const other = await browser.newPage();
  await other.goto("/login");
  await other.getByLabel("아이디").fill(STAFF_ID);
  await other.getByLabel("비밀번호", { exact: true }).fill("1");
  await other.getByRole("button", { name: "로그인" }).click();
  await expect(other).toHaveURL(/\/admin\/product/);
  // 담당자에게는 직원 계정 메뉴가 없다
  await expect(other.getByRole("link", { name: "직원 계정" })).toHaveCount(0);

  const row = page.getByRole("row").filter({ hasText: STAFF_ID });
  await row.getByRole("button", { name: "정지", exact: true }).click();
  await page
    .getByRole("dialog", { name: "정지할까요?" })
    .getByRole("button", { name: "정지" })
    .click();
  await expect(row.getByRole("button", { name: "정지 해제" })).toBeVisible();

  await other.goto("/login");
  await other.getByLabel("아이디").fill(STAFF_ID);
  await other.getByLabel("비밀번호", { exact: true }).fill("1");
  await other.getByRole("button", { name: "로그인" }).click();
  await expect(
    other.getByText("사용이 정지된 계정입니다. 관리자에게 문의해 주세요."),
  ).toBeVisible();
  await other.close();
});
