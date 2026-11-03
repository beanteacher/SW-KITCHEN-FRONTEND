import type { APIRequestContext, APIResponse } from "@playwright/test";

// 화면을 확인할 시험용 제품. 테스트 전에 만들고 끝나면 분류까지 지운다
// 분류는 E2E 분류 테스트가 지우는 "E2E " 로 시작하지 않게 두고, 약어도 그 테스트(QA·QB·UR)와 겹치지 않게 둔다
export const CATEGORY = { big: "시험용 분류", mid: "시험용", abbr: "XT" };
export const NAME_PREFIX = "시험용";

const HEADERS = { "X-Requested-With": "XMLHttpRequest" };

// 1×1 PNG
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

interface TreeItem {
  id: number;
  name: string;
  children: TreeItem[];
}

export interface SeededProducts {
  // 재고품 옵션 2개: 1번은 품절, 2번은 재고 3 · 10% 할인. 사양 2줄, 상세 이미지 2장, 설명
  stockPartlySoldOut: number;
  // 중고품 옵션 1개, 모두 품절. 상세 이미지·설명 없음
  usedSoldOut: number;
  // 신제품 옵션 2개: 129,000원 · 정액 5,000원 할인 139,000원(판매가 134,000원)
  newVaries: number;
  // 신제품 옵션 1개
  newSingle: number;
  // 화면에서 지워 볼 제품 2개
  toDelete: [number, number];
}

async function data<T>(response: APIResponse) {
  if (!response.ok()) {
    throw new Error(`${response.url()} ${response.status()} ${await response.text()}`);
  }
  return ((await response.json()) as { data: T }).data;
}

// 시험용 제품과 분류를 모두 지운다. 지난 실행이 중간에 멈춰 남은 것도 지운다
export async function removeSeedProducts(request: APIRequestContext) {
  const found = await data<{ content: { id: number; name: string }[] }>(
    await request.get("/api/v1/admin/product", {
      headers: HEADERS,
      params: { keyword: NAME_PREFIX, page: 1, size: 20 },
    }),
  );
  const ids = found.content
    .filter((item) => item.name.startsWith(NAME_PREFIX))
    .map((item) => ["ids", String(item.id)]);
  if (ids.length > 0) {
    await data(
      await request.delete("/api/v1/admin/product", {
        headers: HEADERS,
        params: new URLSearchParams(ids),
      }),
    );
  }

  const tree = await data<TreeItem[]>(
    await request.get("/api/v1/admin/category", { headers: HEADERS }),
  );
  for (const big of tree.filter((item) => item.name === CATEGORY.big)) {
    for (const mid of big.children ?? []) {
      await request.delete(`/api/v1/admin/category/${mid.id}`, { headers: HEADERS });
    }
    await request.delete(`/api/v1/admin/category/${big.id}`, { headers: HEADERS });
  }
}

async function createCategory(request: APIRequestContext) {
  const big = await data<TreeItem>(
    await request.post("/api/v1/admin/category", {
      headers: HEADERS,
      data: { name: CATEGORY.big, abbr: CATEGORY.abbr },
    }),
  );
  const mid = await data<TreeItem>(
    await request.post("/api/v1/admin/category", {
      headers: HEADERS,
      data: { parentId: big.id, name: CATEGORY.mid, abbr: CATEGORY.abbr },
    }),
  );
  return mid.id;
}

async function uploadImage(request: APIRequestContext) {
  const image = await data<{ key: string }>(
    await request.post("/api/v1/admin/image", {
      headers: HEADERS,
      multipart: { file: { name: "seed.png", mimeType: "image/png", buffer: PNG } },
    }),
  );
  return image.key;
}

// 로그인한 요청으로 부른다. 남은 시험용 데이터를 지우고 새로 만든다
export async function seedProducts(request: APIRequestContext): Promise<SeededProducts> {
  await removeSeedProducts(request);
  const categoryId = await createCategory(request);
  const imageKey = await uploadImage(request);

  const create = async (name: string, body: Record<string, unknown>) => {
    const options = (body.options as Record<string, unknown>[]).map((option) => ({
      depthMm: 600,
      heightMm: 800,
      discountType: "NONE",
      mainImageKey: imageKey,
      ...option,
    }));
    const product = await data<{ id: number }>(
      await request.post("/api/v1/admin/product", {
        headers: HEADERS,
        data: {
          categoryId,
          name: `${NAME_PREFIX} ${name}`,
          manufacturer: "시험제조",
          origin: "국산",
          materials: ["STAINLESS"],
          ...body,
          detailImageKeys: body.detailImageKeys === true ? [imageKey, imageKey] : [],
          options,
        },
      }),
    );
    return product.id;
  };

  return {
    stockPartlySoldOut: await create("재고품 일부 품절", {
      salesType: "STOCK",
      description: "시험용 설명입니다.\n둘째 줄입니다.",
      specs: [
        { name: "소비전력", value: "1300W" },
        { name: "전원", value: "단상 220V" },
      ],
      detailImageKeys: true,
      options: [
        { widthMm: 1200, listPrice: 100000, stockQty: 0 },
        { widthMm: 1500, listPrice: 100000, discountType: "RATE", discountValue: 10, stockQty: 3 },
      ],
    }),
    usedSoldOut: await create("중고품 모두 품절", {
      salesType: "USED",
      options: [{ widthMm: 900, listPrice: 50000, stockQty: 0 }],
    }),
    newVaries: await create("신제품 가격 다름", {
      salesType: "NEW",
      options: [
        { widthMm: 900, listPrice: 129000 },
        { widthMm: 1200, listPrice: 139000, discountType: "AMOUNT", discountValue: 5000 },
      ],
    }),
    newSingle: await create("신제품 옵션 하나", {
      salesType: "NEW",
      options: [{ widthMm: 1800, listPrice: 200000 }],
    }),
    toDelete: [
      await create("지울 제품 1", {
        salesType: "NEW",
        options: [{ widthMm: 600, listPrice: 1000 }],
      }),
      await create("지울 제품 2", {
        salesType: "NEW",
        options: [{ widthMm: 700, listPrice: 1000 }],
      }),
    ],
  };
}
