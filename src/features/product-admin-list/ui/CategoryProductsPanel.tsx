"use client";

import { useState } from "react";
import { formatNumber } from "@/shared/lib";
import { AdminSidePanel } from "@/shared/ui/admin";
import { PAGE_SIZE } from "../model/useProductListActions";
import ProductListPanel, { TableMessage } from "./ProductListPanel";

export interface CategoryProductsTarget {
  id: number;
  name: string;
  // 중분류면 대분류 이름. 대분류면 없다
  parentName?: string;
}

interface Props {
  target: CategoryProductsTarget | null;
  onClose: () => void;
}

// 분류에 연결된 제품을 옆 패널에서 보고 골라 지운다. 대분류면 아래 모든 중분류 제품이다
// 페이지는 패널 안에서만 넘기고 뒤 화면 주소는 그대로 둔다
export default function CategoryProductsPanel({ target, onClose }: Props) {
  // 다른 분류를 열면 1페이지부터 본다
  const [paging, setPaging] = useState({ categoryId: target?.id, page: 1 });
  const page = paging.categoryId === target?.id ? paging.page : 1;

  return (
    <AdminSidePanel
      open={target !== null}
      onClose={onClose}
      title={target ? `제품 — ${target.name}` : ""}
      description={
        target &&
        (target.parentName
          ? `${target.parentName} > ${target.name} 에 연결된 제품입니다. 모두 삭제하면 이 분류를 삭제할 수 있습니다.`
          : `${target.name} 아래 모든 중분류에 연결된 제품입니다.`)
      }
    >
      {target && (
        <ProductListPanel
          readOnly
          params={{ categoryId: target.id, page, size: PAGE_SIZE }}
          pageTarget={{ onPageChange: (next) => setPaging({ categoryId: target.id, page: next }) }}
          renderCount={(total) => (
            <>
              제품 <b className="text-admin-error">{formatNumber(total)}</b>개
            </>
          )}
          renderEmpty={() => (
            <TableMessage
              message={
                <>
                  이 분류에 연결된 제품이 없습니다.
                  <br />
                  패널을 닫고 분류를 삭제할 수 있습니다.
                </>
              }
            />
          )}
        />
      )}
    </AdminSidePanel>
  );
}
