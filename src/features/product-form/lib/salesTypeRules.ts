import type { ProductDto } from "@/entities/product";

type SalesType = ProductDto.SalesType;

// 수정 화면에서 판매 구분 동그라미를 잠그는 이유. 바꿀 수 있으면 null
// 서버가 허락하는 변경은 신제품 → 재고품, 예약이 없는 재고품 → 신제품 둘뿐이다. 등록 화면은 셋 다 고를 수 있다
export function getSalesTypeLockReason(
  original: SalesType | null,
  target: SalesType,
  hasReserved: boolean,
) {
  if (original === null || original === target) return null;
  if (original === "NEW" && target === "STOCK") return null;
  if (original === "STOCK" && target === "NEW") {
    return hasReserved ? "예약이 있어 신제품으로 바꿀 수 없습니다" : null;
  }
  if (target === "USED") return "새 제품을 중고품으로 바꿀 수 없습니다";
  return "중고품은 다른 판매 구분으로 바꿀 수 없습니다";
}

// 판매 구분을 바꿨을 때 그 아래 띄우는 파란 안내. 없으면 null
export function getSalesTypeNotice(original: SalesType | null, target: SalesType | null) {
  if (original === "NEW" && target === "STOCK") {
    return "재고품으로 바꾸면 신제품 목록에서 빠지고 재고·중고품 목록에 나옵니다. 옵션마다 남은 수량을 넣어 주세요. 상품 코드는 그대로입니다.";
  }
  if (original === "STOCK" && target === "NEW") {
    return "신제품으로 바꾸면 재고 수량을 지우고 품절 없이 팝니다.";
  }
  return null;
}
