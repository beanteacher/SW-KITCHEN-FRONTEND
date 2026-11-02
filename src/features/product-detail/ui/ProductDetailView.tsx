import { notFound } from "next/navigation";
import { ProductApi, type ProductDto } from "@/entities/product";
import { ApiError } from "@/shared/api";
import { RefreshErrorView } from "@/shared/ui";
import ProductDetail from "./ProductDetail";

interface Props {
  id: number;
}

// 상세를 서버에서 불러온다. 없는 제품은 404 로 보내고(검색 엔진이 담지 않게), 그 밖의 오류는 [다시 시도]
export default async function ProductDetailView({ id }: Props) {
  let product: ProductDto.Detail;
  try {
    product = await ProductApi.detail(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    return <RefreshErrorView message="제품을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요" />;
  }

  return <ProductDetail product={product} />;
}
