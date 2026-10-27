"use client";

import type { MouseEvent } from "react";
import type { CategoryDto } from "@/entities/category";
import { cn } from "@/shared/lib";
import { AdminButton, AdminTable, AdminTd, AdminTh } from "@/shared/ui/admin";
import { getCodePrefix } from "../lib/categoryRules";
import type { CategoryPanelHandlers } from "../model/client/categoryAdminTypes";
import type { CategorySchema } from "../model/schema/categorySchema";
import { useCreateCategory, useEditCategory } from "../model/useCategoryAdminQueries";
import CategoryInputRow from "./CategoryInputRow";

interface Props extends CategoryPanelHandlers {
  // 없으면 대분류 표, 있으면 그 대분류 아래 중분류 표
  parent: CategoryDto.AdminTree | null;
  categories: CategoryDto.AdminTree[];
  selectedId?: number;
  onSelect?: (id: number) => void;
  onMove: (id: number, direction: -1 | 1) => void;
}

function ProductCount({ count }: { count: number }) {
  if (count === 0) return <span className="text-faint">0</span>;
  return count.toLocaleString();
}

export default function CategoryPanel({
  parent,
  categories,
  selectedId,
  editingId,
  isMoving,
  onSelect,
  onEdit,
  onMove,
  onDelete,
  onDone,
}: Props) {
  const { mutateAsync: create } = useCreateCategory();
  const { mutateAsync: edit } = useEditCategory();

  const isEditing = editingId !== null;
  const label = parent ? "중분류" : "대분류";

  const handleCreate = async (values: CategorySchema.CreateFormValues) => {
    await create({ parentId: parent?.id ?? null, ...values });
    onDone("추가 완료", `"${values.name}" 분류가 추가되었습니다.`);
  };

  // 바뀐 값만 보낸다. 잠긴 약어는 칸이 막혀 있어 늘 그대로다
  const handleEdit =
    (category: CategoryDto.AdminTree) => async (values: CategorySchema.CreateFormValues) => {
      const data: CategoryDto.EditForm = { name: values.name };
      if (values.abbr !== category.abbr) data.abbr = values.abbr;
      await edit({ id: category.id, data });
      onEdit(null);
      onDone("저장 완료", "저장되었습니다.");
    };

  // 대분류 줄은 아무 데나 눌러도 고른다. 줄 안의 버튼·입력칸은 제 할 일만 한다
  const handleRowClick = (id: number) => (event: MouseEvent<HTMLTableRowElement>) => {
    if (event.target instanceof Element && event.target.closest("button, input")) return;
    onSelect?.(id);
  };

  const moveButtons = (category: CategoryDto.AdminTree, index: number) => (
    <div className="flex justify-center gap-0.5">
      <AdminButton
        size="xs"
        variant="outline"
        className="w-6 px-0"
        aria-label={`${category.name} 위로`}
        disabled={index === 0 || isEditing || isMoving}
        onClick={() => onMove(category.id, -1)}
      >
        ▲
      </AdminButton>
      <AdminButton
        size="xs"
        variant="outline"
        className="w-6 px-0"
        aria-label={`${category.name} 아래로`}
        disabled={index === categories.length - 1 || isEditing || isMoving}
        onClick={() => onMove(category.id, 1)}
      >
        ▼
      </AdminButton>
    </div>
  );

  return (
    <section aria-label={label}>
      <h2 className="mb-2 flex items-baseline gap-1.5 text-sm leading-[normal] font-bold">
        {label}
        <small className="text-xs font-normal text-admin-muted">
          {parent
            ? `${parent.name} (${parent.abbr}) 아래 · 약어는 이 대분류 안에서만 겹치지 않으면 됨`
            : "약어는 대분류끼리 겹치면 안 됨"}
        </small>
      </h2>
      <AdminTable>
        {/* 분류 표의 칸은 높이 40, 위아래 여백 4 (분류 관리 시안) */}
        <table className="w-full table-fixed border-collapse leading-[18px] [&_td]:h-10 [&_td]:py-1">
          <colgroup>
            <col className="w-[72px]" />
            <col />
            <col className={parent ? "w-[120px]" : "w-[96px]"} />
            <col className="w-[64px]" />
            <col className="w-[100px]" />
          </colgroup>
          <thead>
            <tr>
              <AdminTh>순서</AdminTh>
              <AdminTh>이름</AdminTh>
              <AdminTh title="상품 코드 앞자리에 쓰는 영문 대문자 2자">
                {parent ? "약어 · 코드 앞자리" : "약어"}
              </AdminTh>
              <AdminTh title="이 분류에 연결된 제품 수">제품 수</AdminTh>
              <AdminTh>관리</AdminTh>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <AdminTd colSpan={5} className="py-6 leading-5 text-admin-sub">
                  {parent ? (
                    <>
                      중분류가 없습니다. 아래에서 추가하세요.
                      <br />
                      제품은 중분류에만 연결됩니다.
                    </>
                  ) : (
                    "분류가 없습니다. 대분류부터 추가하세요."
                  )}
                </AdminTd>
              </tr>
            )}
            {categories.map((category, index) => {
              const selected = !parent && category.id === selectedId;

              if (category.id === editingId) {
                return (
                  <CategoryInputRow
                    key={category.id}
                    siblings={categories}
                    editing={{ category, abbrLocked: (category.productCount ?? 0) > 0 }}
                    order={moveButtons(category, index)}
                    productCount={<ProductCount count={category.productCount ?? 0} />}
                    selected={selected}
                    onSubmit={handleEdit(category)}
                    onCancel={() => onEdit(null)}
                  />
                );
              }

              return (
                <tr
                  key={category.id}
                  onClick={parent ? undefined : handleRowClick(category.id)}
                  className={cn(
                    !parent && "cursor-pointer hover:bg-row-hover",
                    selected && "bg-picked hover:bg-picked",
                  )}
                >
                  <AdminTd>{moveButtons(category, index)}</AdminTd>
                  <AdminTd className="text-left">
                    {parent ? (
                      category.name
                    ) : (
                      <button
                        type="button"
                        aria-pressed={selected}
                        className={cn("text-left", selected && "font-bold")}
                        onClick={() => onSelect?.(category.id)}
                      >
                        {category.name}
                      </button>
                    )}
                    {!parent && (
                      <span className="ml-1 text-faint">({category.children?.length ?? 0})</span>
                    )}
                  </AdminTd>
                  <AdminTd className="font-mono text-xs leading-[18px]">
                    {category.abbr}
                    {parent && (
                      <span className="text-faint"> · {getCodePrefix(parent, category)}</span>
                    )}
                  </AdminTd>
                  <AdminTd className="text-right tabular-nums">
                    <ProductCount count={category.productCount ?? 0} />
                  </AdminTd>
                  <AdminTd className="whitespace-nowrap">
                    <AdminButton
                      size="xs"
                      variant="outline"
                      disabled={isEditing}
                      onClick={() => onEdit(category.id)}
                    >
                      수정
                    </AdminButton>
                    <AdminButton
                      size="xs"
                      variant="outline"
                      className="ml-1"
                      disabled={isEditing}
                      onClick={() => onDelete(category)}
                    >
                      삭제
                    </AdminButton>
                  </AdminTd>
                </tr>
              );
            })}
            <CategoryInputRow
              siblings={categories}
              order={<span className="text-faint">신규</span>}
              disabled={isEditing}
              onSubmit={handleCreate}
            />
          </tbody>
        </table>
      </AdminTable>
    </section>
  );
}
