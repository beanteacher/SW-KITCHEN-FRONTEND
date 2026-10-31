"use client";

import { AdminFormField, AdminHint, AdminTable } from "@/shared/ui/admin";
import ImageStrip from "./ImageStrip";
import SectionHeader from "./SectionHeader";

// 공통 추가 이미지·상세 이미지. 옵션 대표 이미지는 옵션 표에서 올린다
export default function ImageSection() {
  return (
    <section aria-label="이미지">
      <SectionHeader title="이미지" note="옵션 대표 이미지는 옵션 표에서 올립니다" />
      <AdminTable>
        <AdminFormField
          label="공통 추가 이미지"
          hint={<AdminHint>모든 옵션에서 옵션 이미지 뒤에 나옵니다.</AdminHint>}
        >
          {() => <ImageStrip name="images" max={10} label="공통 추가 이미지" />}
        </AdminFormField>
        <AdminFormField
          label="상세 이미지"
          hint={
            <AdminHint>
              고객 상세의 &quot;상품설명&quot;에 이 순서대로 이어 붙여 나옵니다.
            </AdminHint>
          }
        >
          {() => <ImageStrip name="detailImages" max={20} label="상세 이미지" />}
        </AdminFormField>
      </AdminTable>
    </section>
  );
}
