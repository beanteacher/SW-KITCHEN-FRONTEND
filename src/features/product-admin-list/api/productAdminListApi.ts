import { apiRequest } from "@/shared/api";

export * as ProductAdminListApi from "./productAdminListApi";

const BASE_URL = "admin/product";

// 고른 제품을 한 번에 지운다. 하나라도 못 지우면 아무것도 지우지 않는다
export const remove = (ids: number[]) =>
  apiRequest<void>(BASE_URL, {
    method: "delete",
    searchParams: new URLSearchParams(ids.map((id) => ["ids", String(id)])),
  });
