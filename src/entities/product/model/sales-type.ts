export type SalesType = "NEW" | "STOCK" | "USED";

export const SALES_TYPE_LABEL: Record<SalesType, string> = {
  NEW: "신제품",
  STOCK: "재고품",
  USED: "중고품",
};
