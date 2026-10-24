import { Search } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { HeaderAuth } from "./header-auth";
import { StoreNav, StoreNavWithPath } from "./store-nav";

// 메뉴 줄 → 로고 줄 → 검색창 줄. 화면 전체 너비에 좌우 16px 만 띄운다
export function StoreHeader() {
  return (
    <header className="bg-ink text-white">
      <div className="flex h-14 items-center justify-between pr-2.5 pl-4">
        {/* 주소를 읽는 부분만 따로 기다리게 해서 머리글 나머지는 바로 그린다 */}
        <Suspense fallback={<StoreNav />}>
          <StoreNavWithPath />
        </Suspense>
        <div className="flex h-full items-center">
          <Link
            href="/cart"
            className="flex h-full items-center px-1 text-xs font-medium text-white/80 xl:px-1.5 xl:text-sm"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="mr-0.5 hidden size-4 xl:block"
              aria-hidden
            >
              <path
                d="M6 6V4a2 2 0 1 1 4 0v2M12.8 6.3v6.6a.3.3 0 0 1-.3.3h-9a.3.3 0 0 1-.3-.3V6.3a.3.3 0 0 1 .3-.3h9a.3.3 0 0 1 .3.3Z"
                stroke="currentColor"
              />
            </svg>
            장바구니
          </Link>
          <HeaderAuth />
        </div>
      </div>
      <div className="px-4 pb-3">
        {/* ponytail: 로고는 아직 정하지 않아서 글자로 둔다 */}
        <Link
          href="/"
          className="flex h-[52px] w-fit items-center text-xl font-extrabold tracking-[-0.5px] whitespace-nowrap"
        >
          성원종합주방
        </Link>
        {/* 엔터를 누르면 /search?keyword=… 로 간다. 빈 값과 50자 넘는 값은 브라우저가 막는다 */}
        <form action="/search" role="search" className="relative w-full">
          <input
            type="search"
            name="keyword"
            required
            maxLength={50}
            pattern=".*\S.*"
            title="검색어를 입력해 주세요."
            aria-label="검색어"
            placeholder="제품명, 상품 코드, 제조사로 검색"
            className="h-9 w-full rounded-[4px] bg-white pr-10 pl-2 text-sm text-black outline-none placeholder:text-[#8a8a8a] focus-visible:ring-2 focus-visible:ring-white/40"
          />
          <button
            type="submit"
            aria-label="검색"
            className="absolute top-0.5 right-0.5 grid size-8 place-items-center text-[#5a5a5a]"
          >
            <Search className="size-[18px]" strokeWidth={1.8} aria-hidden />
          </button>
        </form>
      </div>
    </header>
  );
}
