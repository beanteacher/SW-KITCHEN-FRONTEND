import { Refrigerator } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/shared/lib";
import { formatDiscount } from "../lib/formatDiscount";
import type { ProductDto } from "../model/dto/productDto";
import SalesTypeBadge from "./SalesTypeBadge";

interface Props {
  product: ProductDto.Summary;
  // 신제품 목록은 모두 신제품이라 판매 구분을 숨긴다
  showSalesType?: boolean;
}

// 목록 카드: 세로 이미지 아래 판매 구분 · 제조사 · 제품명 · 가격. 카드 전체가 상세로 가는 링크다
export default function ProductCard({ product, showSalesType = true }: Props) {
  const {
    listPrice = 0,
    salePrice = 0,
    discountType = "NONE",
    discountValue = null,
    varies,
  } = product.price ?? {};
  const discount = formatDiscount(discountType, discountValue);

  return (
    <Link href={`/product/${product.id}`} className="flex flex-col text-[#333]">
      <div className="mb-2 grid aspect-[249/320] place-items-center overflow-hidden rounded-[4px] bg-[#f5f5f5] text-[#a3a3a3]">
        {product.mainImageUrl ? (
          // 올린 이미지는 저장소 주소라 next/image 최적화를 거치지 않는다
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.mainImageUrl} alt="" className="size-full object-cover" />
        ) : (
          <Refrigerator className="size-[46%]" strokeWidth={1.5} aria-hidden />
        )}
      </div>
      {showSalesType && product.salesType && (
        <span className="mb-1">
          <SalesTypeBadge salesType={product.salesType} />
        </span>
      )}
      <span className="mb-1 truncate text-[13px] leading-[18px] font-semibold text-black">
        {product.manufacturer}
      </span>
      <strong className="line-clamp-2 text-base leading-6 font-normal">{product.name}</strong>
      <span className="mt-2">
        {discount && (
          <s className="block text-sm leading-4 text-[#bcc4cc]">{formatPrice(listPrice)}</s>
        )}
        <span className="text-base leading-6 font-bold text-[#222]">
          {discount && <span className="mr-1 text-[#fa622f]">{discount}</span>}
          {formatPrice(salePrice)}
          {varies && "~"}
        </span>
      </span>
    </Link>
  );
}
