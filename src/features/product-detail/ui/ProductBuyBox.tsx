import type { ProductDto } from "@/entities/product";
import { formatNumber } from "@/shared/lib";
import { maxQty } from "../lib/productOption";

// 560×56 검정 버튼. 누를 수 없으면 회색
const BUY_BUTTON_CLASS =
  "mt-3 h-14 w-full rounded-xl bg-[#1a1b1f] text-lg font-semibold text-white disabled:cursor-default disabled:bg-[#ddd]";

interface Props {
  option: ProductDto.Option;
  qty: number;
  onQtyChange: (qty: number) => void;
  // 모든 옵션이 품절. 다시 들어오지 않으므로 재입고 문의는 없다
  soldOut: boolean;
}

// 수량 · 총 상품금액 · [장바구니 담기]
export default function ProductBuyBox({ option, qty, onQtyChange, soldOut }: Props) {
  if (soldOut) {
    return (
      <>
        <p className="mt-5 rounded-lg bg-[#f7f7f7] p-3.5 text-center text-sm text-[#565e67]">
          판매된 제품입니다.
        </p>
        <button type="button" disabled className={BUY_BUTTON_CLASS}>
          품절
        </button>
      </>
    );
  }

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <span>수량</span>
        <span className="flex h-8 items-center rounded-2xl bg-[#f4f4f4]">
          <button
            type="button"
            aria-label="빼기"
            disabled={qty <= 1}
            onClick={() => onQtyChange(qty - 1)}
            className="size-8 text-lg text-[#333] disabled:text-[#ccc]"
          >
            −
          </button>
          <span aria-label="수량" className="min-w-6 text-center text-base font-semibold">
            {qty}
          </span>
          <button
            type="button"
            aria-label="더하기"
            disabled={qty >= maxQty(option)}
            onClick={() => onQtyChange(qty + 1)}
            className="size-8 text-lg text-[#333] disabled:text-[#ccc]"
          >
            +
          </button>
        </span>
      </div>
      <p className="mt-5 flex items-baseline justify-end gap-2 text-[13px]">
        총 상품금액
        <b className="text-4xl leading-[44px]">
          {formatNumber((option.salePrice ?? 0) * qty)}
          <small className="ml-0.5 text-base">원</small>
        </b>
      </p>
      {/* ponytail: 담기는 아직 아무 일도 하지 않는다. 주문 기능을 만들 때 장바구니에 담고 알림을 띄운다 */}
      <button type="button" className={BUY_BUTTON_CLASS}>
        장바구니 담기
      </button>
    </div>
  );
}
