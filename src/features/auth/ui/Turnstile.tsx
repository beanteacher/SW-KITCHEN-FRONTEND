"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { env } from "@/shared/config";

interface TurnstileApi {
  render: (
    element: HTMLElement,
    options: { sitekey: string; callback: (token: string) => void },
  ) => string;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface Props {
  onVerify: (token: string) => void;
}

// Cloudflare 보안문자 칸 (300×65, 업체가 그린다). 풀면 받은 값을 onVerify 로 넘긴다
export default function Turnstile({ onVerify }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(
    () => typeof window !== "undefined" && Boolean(window.turnstile),
  );
  // 화면이 다시 그려져도 칸을 새로 만들지 않게 마지막 함수만 들고 있는다
  const onVerifyRef = useRef(onVerify);
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    if (!loaded || !ref.current || !window.turnstile) return;
    const widgetId = window.turnstile.render(ref.current, {
      sitekey: env.turnstileSiteKey,
      callback: (token) => onVerifyRef.current(token),
    });
    return () => window.turnstile?.remove(widgetId);
  }, [loaded]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={() => setLoaded(true)}
      />
      <div ref={ref} aria-label="보안문자" className="mt-1 min-h-[65px]" />
    </>
  );
}
