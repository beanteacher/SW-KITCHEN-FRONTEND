import type { Page } from "@playwright/test";
import { expect, login, test } from "./fixtures";

// 테스트가 만든 분류는 이름 앞에 붙여 두고 끝나면 지운다
const PREFIX = "E2E ";

interface TreeItem {
  id: number;
  name: string;
  children: TreeItem[];
}

// 실패해도 다음 실행이 겹치지 않게, 테스트가 만든 분류를 중분류부터 API 로 지운다
async function removeTestCategories(page: Page) {
  const headers = { "X-Requested-With": "XMLHttpRequest" };
  const response = await page.request.get("/api/v1/admin/category", { headers });
  if (!response.ok()) return;
  const { data } = (await response.json()) as { data: TreeItem[] };
  const ours = data.filter((big) => big.name.startsWith(PREFIX));
  for (const big of ours) {
    for (const child of big.children) {
      await page.request.delete(`/api/v1/admin/category/${child.id}`, { headers });
    }
    await page.request.delete(`/api/v1/admin/category/${big.id}`, { headers });
  }
}

const panel = (page: Page, name: "대분류" | "중분류") => page.getByRole("region", { name });

const row = (page: Page, name: "대분류" | "중분류", text: string) =>
  panel(page, name).getByRole("row").filter({ hasText: text });

async function closeAlert(page: Page, title: string) {
  const dialog = page.getByRole("dialog", { name: title });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "확인" }).click();
  await expect(dialog).toBeHidden();
}

// 맨 아래 추가 줄에 치고 [추가]
async function addCategory(
  page: Page,
  name: "대분류" | "중분류",
  categoryName: string,
  abbr: string,
) {
  const addRow = panel(page, name).getByRole("row").last();
  await addRow.getByLabel("이름").fill(categoryName);
  await addRow.getByLabel("약어").fill(abbr);
  await addRow.getByRole("button", { name: "추가" }).click();
}

test.beforeEach(async ({ page }) => {
  await login(page, "/login?redirect=%2Fadmin%2Fcategory");
  await removeTestCategories(page);
  await page.reload();
});

test.afterEach(async ({ page }) => {
  await removeTestCategories(page);
});

test("분류를 추가·수정·순서 바꾸기·삭제하고, 막히는 경우는 이유를 보여준다", async ({ page }) => {
  const bigA = `${PREFIX}냉장`;
  const bigB = `${PREFIX}조리`;
  const mid = `${PREFIX}업소용`;

  // 추가: 약어는 대문자로 바뀌고, 끝나면 완료 창이 뜬다
  await addCategory(page, "대분류", bigA, "qa");
  await closeAlert(page, "추가 완료");
  await addCategory(page, "대분류", bigB, "QB");
  await closeAlert(page, "추가 완료");
  await expect(row(page, "대분류", bigA)).toContainText("QA");

  // 형제와 겹치는 약어는 보내기 전에 막고 입력값은 남긴다
  await addCategory(page, "대분류", `${PREFIX}중복`, "QA");
  await expect(panel(page, "대분류").getByText(`"${bigA}"과 겹침`)).toBeVisible();
  await expect(panel(page, "대분류").getByRole("row").last().getByLabel("이름")).toHaveValue(
    `${PREFIX}중복`,
  );

  // 대분류를 고르면 오른쪽에 그 중분류가 나오고 주소에 남는다
  await panel(page, "대분류").getByRole("button", { name: bigA, exact: true }).click();
  await expect(page).toHaveURL(/\?big=\d+$/);
  await expect(panel(page, "중분류")).toContainText("중분류가 없습니다.");
  await addCategory(page, "중분류", mid, "UR");
  await closeAlert(page, "추가 완료");
  await expect(row(page, "중분류", mid)).toContainText("QAUR");

  // 수정: Enter 로 저장한다
  await row(page, "중분류", mid).getByRole("button", { name: "수정" }).click();
  const editName = panel(page, "중분류").getByLabel("이름").first();
  await editName.fill(`${mid}2`);
  await editName.press("Enter");
  await closeAlert(page, "저장 완료");
  await expect(row(page, "중분류", `${mid}2`)).toBeVisible();

  // 순서: 누르면 바로 저장되고 새로 고쳐도 그대로다
  const bIsAboveA = async () => {
    const names = await panel(page, "대분류").getByRole("row").allTextContents();
    const indexOf = (name: string) => names.findIndex((text) => text.includes(name));
    return indexOf(bigB) >= 0 && indexOf(bigB) < indexOf(bigA);
  };
  await row(page, "대분류", bigB)
    .getByRole("button", { name: `${bigB} 위로` })
    .click();
  // 저장과 다시 읽기가 끝나 화면이 바뀐 뒤에 새로 고친다. 도중에 새로 고치면 브라우저가 요청을 끊는다
  await expect.poll(bIsAboveA).toBe(true);
  await page.reload();
  await expect(row(page, "대분류", bigA)).toBeVisible();
  expect(await bIsAboveA()).toBe(true);

  // 삭제: 중분류가 있는 대분류는 이유를 보여주고 지우지 않는다
  await row(page, "대분류", bigA).getByRole("button", { name: "삭제" }).click();
  const blocked = page.getByRole("dialog", { name: "삭제 불가" });
  await expect(blocked).toContainText("중분류가 1개 있어 삭제할 수 없습니다.");
  await blocked.getByRole("button", { name: "확인" }).click();

  // 지울 수 있으면 한 번 더 묻고 지운다
  await row(page, "중분류", `${mid}2`).getByRole("button", { name: "삭제" }).click();
  const confirm = page.getByRole("dialog", { name: "분류 삭제" });
  await confirm.getByRole("button", { name: "삭제" }).click();
  await closeAlert(page, "삭제 완료");
  await expect(row(page, "중분류", `${mid}2`)).toHaveCount(0);
});

test.describe("불러오기 실패", () => {
  // 일부러 낸 500 을 브라우저가 콘솔 오류로 남긴다
  test.use({ expectedConsoleErrors: [/status of 500/] });

  test("분류를 불러오지 못하면 [다시 시도] 로 다시 읽는다", async ({ page }) => {
    // 앞의 새로고침이 다 끝난 뒤에 다시 새로고침한다. 도중에 하면 브라우저가 끊긴 요청을 콘솔 오류로 남긴다
    await expect(page.getByRole("region", { name: "대분류" })).toBeVisible();

    // [다시 시도] 를 누르기 전까지는 서버 오류로 바꾼다 (화면이 한 번 더 시도하는 것까지 실패시킨다)
    let failing = true;
    await page.route("**/api/v1/admin/category", (route) =>
      failing
        ? route.fulfill({
            status: 500,
            json: { success: false, code: "INTERNAL_ERROR", message: "서버 오류" },
          })
        : route.continue(),
    );

    await page.reload();
    await expect(page.getByText("분류를 불러오지 못했습니다.")).toBeVisible();

    failing = false;
    await page.getByRole("button", { name: "다시 시도" }).click();

    await expect(page.getByRole("heading", { name: "분류 관리" })).toBeVisible();
    await expect(page.getByRole("region", { name: "대분류" })).toBeVisible();
  });
});
