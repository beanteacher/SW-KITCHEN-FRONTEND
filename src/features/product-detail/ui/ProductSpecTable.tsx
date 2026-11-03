import type { ProductDto } from "@/entities/product";
import { cn } from "@/shared/lib";
import { formatSize } from "../lib/productOption";

interface Props {
  product: ProductDto.Detail;
  option: ProductDto.Option;
}

const TH_CLASS =
  "w-[180px] border-b border-[#eee] bg-[#f9f9f9] px-4 py-3.5 text-left align-top font-medium text-[#565e67]";
const TD_CLASS = "border-b border-[#eee] px-4 py-3.5 align-top";

// 상품 상세정보: 고정 6줄 다음에 사양 줄. 상품 코드·사이즈는 고른 옵션의 값
export default function ProductSpecTable({ product, option }: Props) {
  const fixedRows = [
    ["제품명", product.name],
    ["제조사", product.manufacturer],
    ["상품 코드", option.productCode],
    ["원산지", product.origin],
    ["사이즈", formatSize(option)],
    ["재질", product.materials?.map((material) => material.name).join(", ")],
  ];

  return (
    <table className="w-full border-collapse border-t border-[#333] text-sm leading-5">
      <tbody>
        {fixedRows.map(([label, value]) => (
          <tr key={label}>
            <th scope="row" className={TH_CLASS}>
              {label}
            </th>
            <td className={TD_CLASS}>{value}</td>
          </tr>
        ))}
        {product.specs?.map((spec, index) => (
          // 사양 첫 줄 위에 선을 하나 더 그어 고정 줄과 나눈다
          <tr key={`${index}-${spec.name}`} className={cn(index === 0 && "border-t border-[#ddd]")}>
            <th scope="row" className={TH_CLASS}>
              {spec.name}
            </th>
            <td className={TD_CLASS}>{spec.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
