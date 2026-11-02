"use client";

import Link from "next/link";
import { type ReactNode, useState } from "react";
import { formatDiscount, type ProductDto, SalesTypeBadge } from "@/entities/product";
import { cn, formatNumber, formatPrice } from "@/shared/lib";
import { Select } from "@/shared/ui";
import { firstBuyableIndex, formatSize, galleryImages, isSoldOut } from "../lib/productOption";
import DetailTabs from "./DetailTabs";
import ProductBuyBox from "./ProductBuyBox";
import ProductGallery from "./ProductGallery";
import ProductSpecTable from "./ProductSpecTable";

interface Props {
  product: ProductDto.Detail;
}

// 현재 위치: 신제품 또는 재고·중고품 > 대분류 > 중분류. 누르면 그 목록을 그 분류로 거른다
function Crumb({ product }: Props) {
  const isNew = product.salesType === "NEW";
  const listPath = isNew ? "/product/new" : "/product/stock";
  const mid = product.category;
  const big = mid?.parent;
  const separator = <span className="mx-1.5 text-[#b3b3b3]">›</span>;

  return (
    <nav aria-label="현재 위치" className="mb-5 text-[#666]">
      <Link href={listPath} className="hover:underline">
        {isNew ? "신제품" : "재고·중고품"}
      </Link>
      {[big, mid].map(
        (category) =>
          category && (
            <span key={category.id}>
              {separator}
              <Link href={`${listPath}?categoryId=${category.id}`} className="hover:underline">
                {category.name}
              </Link>
            </span>
          ),
      )}
    </nav>
  );
}

// 오른쪽 정보 한 줄 (이름 칸 128px)
function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[128px_minmax(0,1fr)] items-center border-t border-[#f4f4f4] py-[17px] text-sm leading-5">
      <dt className="text-[#565e67]">{label}</dt>
      <dd className="text-[#222]">{children}</dd>
    </div>
  );
}

// 제품 상세. 옵션·이미지·수량은 받은 응답 안에서 바꾸고 서버에 다시 묻지 않는다
export default function ProductDetail({ product }: Props) {
  const options = product.options ?? [];
  const [optionIndex, setOptionIndex] = useState(() => firstBuyableIndex(options));
  const [imageIndex, setImageIndex] = useState(0);
  const [qty, setQty] = useState(1);

  const option = options[optionIndex];
  const allSoldOut = options.every(isSoldOut);
  const hasDescription = (product.detailImageUrls?.length ?? 0) > 0 || !!product.description;
  const { listPrice = 0, salePrice = 0, discountType = "NONE", discountValue = null } = option;
  const discount = formatDiscount(discountType, discountValue);

  // 옵션을 바꾸면 이미지는 첫 장, 수량은 1 로
  const handleOptionChange = (id: number) => {
    setOptionIndex(options.findIndex((item) => item.id === id));
    setImageIndex(0);
    setQty(1);
  };

  return (
    // 본문 1050px. 좁아지면 이미지·정보 두 칸이 430:560 비율로 함께 준다
    // ponytail: 768px 보다 좁아도 두 칸 그대로다. 모바일 화면을 다듬을 때 위아래로 쌓는다
    <div className="mx-auto max-w-[1090px] px-5 pt-5 pb-20">
      <Crumb product={product} />
      <div className="grid grid-cols-[minmax(0,430fr)_minmax(0,560fr)] items-start gap-x-[clamp(24px,5vw,60px)]">
        <ProductGallery
          images={galleryImages(product, option)}
          index={imageIndex}
          onSelect={setImageIndex}
          alt={product.name ?? ""}
          soldOut={allSoldOut}
        />
        <div>
          {product.salesType && <SalesTypeBadge salesType={product.salesType} />}
          <p className="mt-2 text-base leading-[22px] font-bold text-black">
            {product.manufacturer}
          </p>
          <h1 className="mt-1 text-[28px] leading-9 font-semibold break-keep text-[#222]">
            {product.name}
          </h1>
          <div className="mt-5">
            {discount && (
              <p className="text-base leading-[22px]">
                <span className="mr-1 font-bold text-[#fa622f]">{discount}</span>
                <s className="text-sm text-[#bcc4cc]">{formatPrice(listPrice)}</s>
              </p>
            )}
            <p className="text-[28px] leading-9 font-bold text-[#222]">
              {formatNumber(salePrice)}
              <small className="ml-0.5 text-base">원</small>
            </p>
          </div>
          <dl className="mt-6 border-b border-[#f4f4f4]">
            <InfoRow label="상품 코드">{option.productCode}</InfoRow>
            <InfoRow label="사이즈">
              <Select
                aria-label="사이즈"
                value={option.id}
                onChange={handleOptionChange}
                options={options.map((item) => ({
                  value: item.id,
                  label: formatSize(item),
                  extra: isSoldOut(item) ? "품절" : <b>{formatPrice(item.salePrice ?? 0)}</b>,
                  disabled: isSoldOut(item),
                }))}
              />
            </InfoRow>
            {/* 신제품은 수량을 세지 않아 이 줄이 없다 */}
            {option.visibleQty != null && (
              <InfoRow label="남은 수량">
                {option.visibleQty === 0 ? "품절" : `${option.visibleQty}개`}
              </InfoRow>
            )}
          </dl>
          <ProductBuyBox option={option} qty={qty} onQtyChange={setQty} soldOut={allSoldOut} />
        </div>
      </div>

      <DetailTabs hasDescription={hasDescription} />
      <section id="info" aria-labelledby="info-title" className="scroll-mt-[60px] pt-[60px]">
        <h2 id="info-title" className="mb-4 text-lg font-semibold text-[#333]">
          상품 상세정보
        </h2>
        <ProductSpecTable product={product} option={option} />
      </section>
      {hasDescription && (
        <section id="desc" aria-labelledby="desc-title" className="scroll-mt-[60px] pt-[60px]">
          <h2 id="desc-title" className="mb-4 text-lg font-semibold text-[#333]">
            상품설명
          </h2>
          {product.detailImageUrls?.map((url, index) => (
            // 올린 순서대로 틈 없이 잇는다. 원본보다 키우지 않고, 화면에 가까워질 때 불러온다
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${index}-${url}`}
              src={url}
              alt=""
              loading="lazy"
              className="mx-auto block max-w-full"
            />
          ))}
          {/* 글은 줄바꿈만 살리고 HTML 로 그리지 않는다 */}
          {product.description && (
            <p
              className={cn(
                "text-[15px] leading-[1.8] whitespace-pre-line text-[#333]",
                product.detailImageUrls?.length && "mt-8",
              )}
            >
              {product.description}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
