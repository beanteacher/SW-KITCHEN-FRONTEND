"use client";

import type { FormEvent, ReactNode } from "react";
import type { CategoryDto } from "@/entities/category";
import { type ProductDto, SALES_TYPE_LABEL } from "@/entities/product";
import { AdminButton, AdminInput, AdminRadio, AdminSelect, AdminTable } from "@/shared/ui/admin";
import type { ProductListFilters } from "../lib/productListFilters";

const SALES_TYPES = Object.keys(SALES_TYPE_LABEL) as ProductDto.SalesType[];

interface Props {
  filters: ProductListFilters;
  tree: CategoryDto.Tree[];
  bigId: number | null;
  midId: number | null;
  mids: CategoryDto.Tree[];
  onSearch: (keyword: string) => void;
  onSelectBig: (id: number) => void;
  onSelectMid: (id: number) => void;
  onSelectSalesType: (salesType: ProductDto.SalesType | null) => void;
  onReset: () => void;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <tr className="border-b border-admin-head-line last:border-b-0">
      <th scope="row" className="w-[140px] bg-admin-fill px-4 py-2 font-semibold text-admin-text">
        {label}
      </th>
      <td className="px-3 py-2">{children}</td>
    </tr>
  );
}

// 회색 검색 조건 표 + 가운데 [검색][초기화]. 분류·판매 구분은 고르면 바로 찾는다
export default function ProductSearchBox({
  filters,
  tree,
  bigId,
  midId,
  mids,
  onSearch,
  onSelectBig,
  onSelectMid,
  onSelectSalesType,
  onReset,
}: Props) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(String(new FormData(event.currentTarget).get("keyword") ?? ""));
  };

  return (
    <form role="search" aria-label="제품 검색" noValidate onSubmit={handleSubmit}>
      <AdminTable>
        <table className="w-full border-collapse text-[13px]">
          <tbody>
            <Row label="검색어">
              {/* 초기화·뒤로 가기로 주소가 바뀌면 칸도 주소 값으로 다시 채운다 */}
              <AdminInput
                key={filters.keyword}
                name="keyword"
                defaultValue={filters.keyword}
                maxLength={50}
                placeholder="제품명, 상품 코드, 제조사 모델명"
                aria-label="검색어"
                className="max-w-[420px]"
              />
            </Row>
            <Row label="분류">
              <div className="flex gap-1.5">
                <AdminSelect
                  aria-label="대분류"
                  className="w-[200px]"
                  value={bigId ?? 0}
                  options={[
                    { value: 0, label: "대분류 전체" },
                    ...tree.map((item) => ({ value: item.id, label: item.name ?? "" })),
                  ]}
                  onChange={onSelectBig}
                />
                <AdminSelect
                  aria-label="중분류"
                  className="w-[200px]"
                  disabled={bigId === null}
                  value={midId ?? 0}
                  options={[
                    { value: 0, label: "중분류 전체" },
                    ...mids.map((item) => ({ value: item.id, label: item.name ?? "" })),
                  ]}
                  onChange={onSelectMid}
                />
              </div>
            </Row>
            <Row label="판매 구분">
              <AdminRadio
                name="salesType"
                label="전체"
                checked={filters.salesType === null}
                onChange={() => onSelectSalesType(null)}
              />
              {SALES_TYPES.map((salesType) => (
                <AdminRadio
                  key={salesType}
                  name="salesType"
                  label={SALES_TYPE_LABEL[salesType]}
                  checked={filters.salesType === salesType}
                  onChange={() => onSelectSalesType(salesType)}
                />
              ))}
            </Row>
          </tbody>
        </table>
      </AdminTable>
      <div className="mt-3.5 mb-6 flex justify-center gap-1.5">
        <AdminButton type="submit" className="h-9 min-w-[90px]">
          검색
        </AdminButton>
        <AdminButton variant="outline" className="h-9 min-w-[90px]" onClick={onReset}>
          초기화
        </AdminButton>
      </div>
    </form>
  );
}
