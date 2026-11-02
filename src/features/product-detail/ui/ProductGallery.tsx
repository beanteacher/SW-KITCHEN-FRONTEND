import { Refrigerator } from "lucide-react";
import { cn } from "@/shared/lib";

interface Props {
  images: string[];
  index: number;
  onSelect: (index: number) => void;
  alt: string;
  // 모든 옵션이 품절이면 큰 이미지 위에 "품절"을 덮는다
  soldOut: boolean;
}

// 큰 이미지 + 아래 썸네일 5칸씩. 1장이면 썸네일이 없다
export default function ProductGallery({ images, index, onSelect, alt, soldOut }: Props) {
  const current = images[index];

  return (
    <div>
      <div className="relative grid aspect-[430/552] place-items-center overflow-hidden rounded-[4px] bg-[#f5f5f5] text-[#a3a3a3]">
        {current ? (
          // 올린 이미지는 저장소 주소라 next/image 최적화를 거치지 않는다
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt={alt} className="size-full object-cover" />
        ) : (
          <Refrigerator className="size-[40%]" strokeWidth={1.5} aria-hidden />
        )}
        {soldOut && (
          <span className="absolute inset-0 grid place-items-center bg-white/65 text-[22px] font-bold text-[#333]">
            품절
          </span>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-2 grid grid-cols-5 gap-2">
          {images.map((url, imageIndex) => (
            <button
              key={`${imageIndex}-${url}`}
              type="button"
              aria-label={`${imageIndex + 1}번째 이미지`}
              aria-current={imageIndex === index}
              onClick={() => onSelect(imageIndex)}
              className={cn(
                "aspect-[430/552] overflow-hidden rounded-[4px] border bg-[#f5f5f5]",
                imageIndex === index ? "border-[#333]" : "border-transparent",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
