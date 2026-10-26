import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SalesTypeBadge, type ProductDto } from "@/entities/product";
import { Pagination } from "@/shared/ui";
import AlertPreview from "./AlertPreview";

// ponytail: 공용 부품 모양 확인용 임시 화면. 확인이 끝나면 이 폴더째 지운다
const SALES_TYPES: ProductDto.SalesType[] = ["NEW", "STOCK", "USED"];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-b border-line pb-8">
      <h2 className="text-sm font-bold text-gray-500">{title}</h2>
      {children}
    </section>
  );
}

export default function DevPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="mx-auto flex max-w-[960px] flex-col gap-8 p-10">
      <h1 className="text-xl font-bold">공용 부품 미리보기</h1>

      <Section title="판매 구분 라벨 — 쇼핑몰">
        <div className="flex gap-3">
          {SALES_TYPES.map((type) => (
            <SalesTypeBadge key={type} salesType={type} />
          ))}
        </div>
      </Section>

      <Section title="판매 구분 라벨 — 관리자">
        <div className="flex gap-3">
          {SALES_TYPES.map((type) => (
            <SalesTypeBadge key={type} salesType={type} variant="admin" />
          ))}
        </div>
      </Section>

      <Section title="페이지 번호 — 쇼핑몰 (첫 페이지 · 중간 · 마지막)">
        <Pagination page={1} totalPages={2} getHref={(page) => `?page=${page}`} />
        <Pagination page={9} totalPages={20} getHref={(page) => `?page=${page}`} />
        <Pagination page={20} totalPages={20} getHref={(page) => `?page=${page}`} />
      </Section>

      <Section title="페이지 번호 — 관리자">
        <Pagination page={3} totalPages={12} getHref={(page) => `?page=${page}`} size="sm" />
      </Section>

      <Section title="알림 창 · 짧은 알림 (버튼을 눌러 띄운다)">
        <AlertPreview />
      </Section>
    </main>
  );
}
