"use client";

import { useEffect, useState } from "react";
import { cn } from "@/shared/lib";

const TABS = [
  { id: "info", label: "상세정보" },
  { id: "desc", label: "상품설명" },
];

// 탭 높이. 구역 머리가 이 아래로 들어오면 그 탭이 지금 탭이다
const TAB_HEIGHT = 60;

interface Props {
  // 상세 이미지와 설명이 모두 없으면 [상품설명] 탭을 뺀다
  hasDescription: boolean;
}

// 화면 위에 붙어 따라오는 탭. 누르면 그 구역으로 스크롤하고, 스크롤 위치에 맞춰 지금 탭을 굵게 한다
export default function DetailTabs({ hasDescription }: Props) {
  const tabs = hasDescription ? TABS : TABS.slice(0, 1);
  const [current, setCurrent] = useState(TABS[0].id);

  useEffect(() => {
    const ids = (hasDescription ? TABS : TABS.slice(0, 1)).map((tab) => tab.id);
    const handleScroll = () => {
      let next = ids[0];
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= TAB_HEIGHT + 1) next = id;
      }
      // 마지막 구역이 짧아 위까지 못 올라와도 맨 아래면 마지막 탭
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        next = ids[ids.length - 1];
      }
      setCurrent(next);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasDescription]);

  return (
    <nav aria-label="상세 구역" className="sticky top-0 z-10 mt-[60px] flex bg-white">
      {tabs.map((tab) => (
        <a
          key={tab.id}
          href={`#${tab.id}`}
          aria-current={tab.id === current}
          onClick={(event) => {
            event.preventDefault();
            // 상세 이미지가 내려가는 중에 불러와지면 페이지가 길어져 구역이 위까지 못 올 수 있다. 누른 탭을 바로 지금 탭으로
            setCurrent(tab.id);
            document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth" });
          }}
          className={cn(
            "grid h-[60px] flex-1 place-items-center border border-l-0 border-[#eee] bg-[#fafafa] text-base font-medium text-[#666] first:border-l",
            tab.id === current && "border-b-white bg-white font-bold text-black",
          )}
        >
          {tab.label}
        </a>
      ))}
    </nav>
  );
}
