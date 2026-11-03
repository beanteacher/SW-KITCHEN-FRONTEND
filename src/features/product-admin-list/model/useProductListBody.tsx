"use client";

import { type ReactNode, useState } from "react";
import { type ProductDto, useAdminProducts } from "@/entities/product";
import { ApiError, toApiError } from "@/shared/api";
import { toast } from "@/shared/lib";
import { useDeleteProducts } from "./useProductAdminListQueries";

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

// 관리 목록 한 페이지: 읽기 + 고르기 + 선택 삭제. 제품 관리 화면과 옆 패널이 같이 쓴다
export function useProductListBody(params: ProductDto.AdminSearchParams) {
  const { data, isPending, isError, refetch } = useAdminProducts(params);
  const { mutate: removeProducts, isPending: isDeleting } = useDeleteProducts();
  const [alert, setAlert] = useState<AlertState | null>(null);
  // 고른 제품은 지금 페이지·조건에서만 유효하다. 조건이 바뀌면 key 가 달라져 고른 것이 풀린다
  const selectionKey = JSON.stringify(params);
  const [selection, setSelection] = useState({ key: selectionKey, ids: new Set<number>() });
  const picked = selection.key === selectionKey ? selection.ids : new Set<number>();

  const products = data?.content ?? [];
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
    products,
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 0,
    isPending,
    isError,
    picked,
    allPicked,
    isDeleting,
    alert,
    handleRetry: () => refetch(),
    handleTogglePick,
    handleTogglePickAll,
    handleDelete,
    handleCloseAlert: () => setAlert(null),
  };
}
