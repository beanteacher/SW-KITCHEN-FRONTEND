"use client";

import { type ReactNode, useState } from "react";
import { useCategoryTree } from "@/entities/category";
import { type ProductDto, useAdminProducts } from "@/entities/product";
import { ApiError, toApiError } from "@/shared/api";
import { toast } from "@/shared/lib";
import { useDeleteProducts } from "./useProductAdminListQueries";
import { useProductListSearchParams } from "./useProductListSearchParams";

const PAGE_SIZE = 20;
// 묻기 창에 이름을 보여 줄 제품 수. 넘으면 "외 N개"
const NAMES_SHOWN = 5;

// 관리자 알림 창 하나. confirm 은 [취소] [삭제]
export interface AlertState {
  kind: "warning" | "success" | "confirm";
  title: string;
  message: ReactNode;
  onConfirm?: () => void;
}

function NameList({ names }: { names: string[] }) {
  return (
    <ul className="mt-2 list-disc pl-[18px]">
      {names.map((name, index) => (
        <li key={`${index}-${name}`}>{name}</li>
      ))}
    </ul>
  );
}

// 제품 관리 목록: 주소의 조건으로 목록을 읽고, 찾기 줄·페이지 번호의 동작을 모은다
export function useProductListActions() {
  const { filters, hrefWith, applyFilters, resetFilters } = useProductListSearchParams();
  const { data: tree = [] } = useCategoryTree();

  // categoryId 가 대분류면 그 대분류, 중분류면 그 부모를 고른 것으로 본다
  const big = tree.find(
    (item) =>
      item.id === filters.categoryId ||
      item.children?.some((child) => child.id === filters.categoryId),
  );
  const midId = big && big.id !== filters.categoryId ? filters.categoryId : null;

  const params: ProductDto.AdminSearchParams = {
    keyword: filters.keyword || undefined,
    categoryId: filters.categoryId ?? undefined,
    salesType: filters.salesType ?? undefined,
    page: filters.page,
    size: PAGE_SIZE,
  };
  const { data, isPending, isError, refetch } = useAdminProducts(params);
  const { mutate: removeProducts, isPending: isDeleting } = useDeleteProducts();
  const [alert, setAlert] = useState<AlertState | null>(null);
  // 고른 제품은 지금 페이지·조건에서만 유효하다. 조건이 바뀌면 key 가 달라져 고른 것이 풀린다
  const selectionKey = JSON.stringify(params);
  const [selection, setSelection] = useState({ key: selectionKey, ids: new Set<number>() });
  const picked = selection.key === selectionKey ? selection.ids : new Set<number>();

  const products = data?.content ?? [];
  const isFiltered = Boolean(filters.keyword || filters.categoryId || filters.salesType);
  const allPicked = products.length > 0 && products.every((product) => picked.has(product.id));

  const setPicked = (ids: Set<number>) => setSelection({ key: selectionKey, ids });

  const handleTogglePick = (id: number) => {
    const next = new Set(picked);
    if (!next.delete(id)) next.add(id);
    setPicked(next);
  };

  const handleTogglePickAll = () =>
    setPicked(allPicked ? new Set() : new Set(products.map((product) => product.id)));

  // 예약이 있는 제품은 서버가 막는다. 막힌 제품 이름은 서버가 errors 에 담아 준다
  const handleDelete = () => {
    const targets = products.filter((product) => picked.has(product.id));
    if (targets.length === 0) return;
    const names = targets.slice(0, NAMES_SHOWN).map((product) => product.name ?? `#${product.id}`);
    if (targets.length > NAMES_SHOWN) names.push(`외 ${targets.length - NAMES_SHOWN}개`);

    setAlert({
      kind: "confirm",
      title: "제품 삭제",
      message: (
        <>
          제품 {targets.length}개를 삭제할까요? 옵션·이미지도 함께 지워지고 되돌릴 수 없습니다.
          <NameList names={names} />
        </>
      ),
      onConfirm: () => {
        setAlert(null);
        removeProducts(
          targets.map((product) => product.id),
          {
            onSuccess: () => {
              setPicked(new Set());
              setAlert({
                kind: "success",
                title: "삭제 완료",
                message: `제품 ${targets.length}개를 삭제했습니다.`,
              });
            },
            onError: (error) => {
              if (error instanceof ApiError && error.code === "PRODUCT_IN_USE") {
                setAlert({
                  kind: "warning",
                  title: "삭제 불가",
                  message: (
                    <>
                      예약(잡아 둔 수량)이 있는 제품은 삭제할 수 없습니다. 아래 제품을 빼고 다시
                      골라 주세요. 아무것도 삭제하지 않았습니다.
                      <NameList names={error.fieldErrors.map((item) => item.message)} />
                    </>
                  ),
                });
                return;
              }
              toast(toApiError(error).message, "error");
            },
          },
        );
      },
    });
  };

  return {
    filters,
    tree,
    bigId: big?.id ?? null,
    midId,
    mids: big?.children ?? [],
    products,
    picked,
    allPicked,
    isDeleting,
    alert,
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    isPending,
    isError,
    isFiltered,
    pageHref: (page: number) => hrefWith({ page }),
    handleSearch: (keyword: string) => applyFilters({ keyword: keyword.trim() }),
    // 대분류를 바꾸면 중분류는 "전체"로 돌아간다. 0 은 "전체"
    handleSelectBig: (id: number) => applyFilters({ categoryId: id || null }),
    handleSelectMid: (id: number) => applyFilters({ categoryId: id || big?.id || null }),
    handleSelectSalesType: (salesType: ProductDto.SalesType | null) => applyFilters({ salesType }),
    handleReset: resetFilters,
    handleRetry: () => refetch(),
    handleTogglePick,
    handleTogglePickAll,
    handleDelete,
    handleCloseAlert: () => setAlert(null),
  };
}
