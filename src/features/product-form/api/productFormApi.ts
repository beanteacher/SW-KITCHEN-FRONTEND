import type { ProductDto } from "@/entities/product";
import { apiRequest } from "@/shared/api";

export * as ProductFormApi from "./productFormApi";

const BASE_URL = "admin/product";
const IMAGE_URL = "admin/image";

// 등록·수정 응답은 수정 화면용 제품 전체와 같다 (서버가 만든 상품 코드·판매가 포함)
export const create = (data: ProductDto.SaveForm) =>
  apiRequest<ProductDto.AdminDetail>(BASE_URL, { method: "post", json: data });

export const edit = (id: number, data: ProductDto.SaveForm) =>
  apiRequest<ProductDto.AdminDetail>(`${BASE_URL}/${id}`, { method: "put", json: data });

// 파일을 고르는 즉시 한 장씩 올려 키를 받는다. 저장할 때는 키만 보낸다
export const uploadImage = (file: File) => {
  const body = new FormData();
  body.append("file", file);
  return apiRequest<ProductDto.Image>(IMAGE_URL, { method: "post", body });
};
