import Link from "next/link";
import { type ProductDto, SalesTypeBadge } from "@/entities/product";
import { cn, formatNumber, formatPrice } from "@/shared/lib";
import { AdminCheckbox, AdminTd, AdminTh, adminButtonClass } from "@/shared/ui/admin";

// 제품 칸만 남는 폭을 받고 나머지는 너비를 고정한다
const COLUMNS = [
  { label: "고르기", width: 36 },
  { label: "제품", width: undefined },
  { label: "대분류", width: 100 },
  { label: "중분류", width: 110 },
  { label: "판매 구분", width: 72 },
  { label: "상품 코드", width: 130 },
  { label: "제조사 모델명", width: 120 },
  { label: "판매가", width: 104 },
  { label: "재고", width: 56, title: "창고에 있는 수량" },
  { label: "예약", width: 56, title: "주문·견적에 묶여 아직 나가지 않은 수량" },
  { label: "판매 가능", width: 76, title: "재고 − 예약. 고객 화면에 보이는 수량" },
  { label: "관리", width: 64 },
];

const NUM = "text-right tabular-nums whitespace-nowrap";
const CODE = "font-mono text-xs";
const MUTED = <span className="text-faint">—</span>;

function QtyCells({ option }: { option: ProductDto.AdminSummaryOption }) {
  // 신제품은 재고를 세지 않는다
  if (option.stockQty == null) {
    return (
      <>
        <AdminTd>{MUTED}</AdminTd>
        <AdminTd>{MUTED}</AdminTd>
        {/* 옵션 둘째 줄부터는 이 칸이 줄 끝이라도 오른쪽에 [수정] 칸이 붙어 있다 */}
        <AdminTd className="last:border-r">{MUTED}</AdminTd>
      </>
    );
  }
  const reserved = option.reservedQty ?? 0;
  const visible = option.visibleQty ?? 0;
  return (
    <>
      <AdminTd className={NUM}>{formatNumber(option.stockQty)}</AdminTd>
      <AdminTd className={cn(NUM, reserved ? "font-semibold text-[#b26200]" : "text-faint")}>
        {formatNumber(reserved)}
      </AdminTd>
      <AdminTd
        className={cn(
          NUM,
          "font-semibold last:border-r",
          visible ? "text-[#2357c6]" : "text-admin-error",
        )}
      >
        {visible ? formatNumber(visible) : "품절"}
      </AdminTd>
    </>
  );
}

interface RowProps {
  product: ProductDto.AdminSummary;
  picked: boolean;
  onTogglePick: (id: number) => void;
}

// 제품 하나를 옵션 수만큼의 줄로 그린다. 고르기·제품 칸과 [수정]은 세로로 합친다
function ProductRows({ product, picked, onTogglePick }: RowProps) {
  const options = product.options ?? [];
  const span = options.length;
  const [big, mid] = (product.categoryName ?? "").split(" > ");

  return options.map((option, index) => (
    <tr
      key={option.id}
      className={cn(
        index === 0 && "[&>td]:border-t [&>td]:border-t-admin-line",
        picked && "[&>td]:bg-[#f6f8fb]",
      )}
    >
      {index === 0 && (
        <>
          <AdminTd rowSpan={span}>
            <AdminCheckbox
              label={`${product.name} 고르기`}
              hideLabel
              checked={picked}
              onChange={() => onTogglePick(product.id)}
            />
          </AdminTd>
          <AdminTd rowSpan={span} className="text-left">
            {/* 제품명도 [수정]과 같이 수정 화면으로 간다 */}
            <Link
              href={`/admin/product/${product.id}/edit`}
              className="block text-[13px] font-medium hover:underline"
            >
              {product.name}
            </Link>
            <span className="text-xs text-admin-muted">
              {product.manufacturer} · #{product.id}
            </span>
          </AdminTd>
          <AdminTd rowSpan={span}>{big}</AdminTd>
          <AdminTd rowSpan={span}>{mid}</AdminTd>
          <AdminTd rowSpan={span}>
            {product.salesType && <SalesTypeBadge salesType={product.salesType} variant="admin" />}
          </AdminTd>
        </>
      )}
      <AdminTd className={CODE}>{option.productCode}</AdminTd>
      <AdminTd className={CODE}>{option.modelName || MUTED}</AdminTd>
      <AdminTd className={NUM}>{formatPrice(option.salePrice ?? 0)}</AdminTd>
      <QtyCells option={option} />
      {index === 0 && (
        <AdminTd rowSpan={span}>
          <Link
            href={`/admin/product/${product.id}/edit`}
            className={adminButtonClass({ variant: "outline", size: "xs" })}
          >
            수정
          </Link>
        </AdminTd>
      )}
    </tr>
  ));
}

interface Props {
  products: ProductDto.AdminSummary[];
  picked: ReadonlySet<number>;
  allPicked: boolean;
  onTogglePick: (id: number) => void;
  onTogglePickAll: () => void;
}

// 화면이 1280px 보다 좁으면 표만 가로로 스크롤된다
export default function ProductListTable({
  products,
  picked,
  allPicked,
  onTogglePick,
  onTogglePickAll,
}: Props) {
  return (
    <div className="overflow-x-auto border border-t-2 border-admin-line border-t-ink bg-white">
      <table className="w-full min-w-[1056px] table-fixed border-collapse leading-[18px] [&_tbody>tr:first-child>td]:border-t-0">
        <colgroup>
          {COLUMNS.map(({ label, width }) => (
            <col key={label} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {COLUMNS.map(({ label, title }) =>
              label === "고르기" ? (
                <AdminTh key={label}>
                  <AdminCheckbox
                    label="이 페이지 제품 모두 고르기"
                    hideLabel
                    checked={allPicked}
                    onChange={onTogglePickAll}
                  />
                </AdminTh>
              ) : (
                <AdminTh key={label} title={title}>
                  {label}
                </AdminTh>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRows
              key={product.id}
              product={product}
              picked={picked.has(product.id)}
              onTogglePick={onTogglePick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
