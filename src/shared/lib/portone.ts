import { env } from "@/shared/config";

// 포트원 본인인증 창. 업체 창은 사용자가 누른 그 순간에 열어야 브라우저가 막지 않아서, 스크립트는 미리 받아 둔다
const SDK_URL = "https://cdn.portone.io/v2/browser-sdk.js";

interface PortOneResponse {
  code?: string;
  message?: string;
  identityVerificationId?: string;
}

interface PortOneSdk {
  requestIdentityVerification: (options: {
    storeId: string;
    identityVerificationId: string;
    channelKey: string;
  }) => Promise<PortOneResponse | undefined>;
}

declare global {
  interface Window {
    PortOne?: PortOneSdk;
  }
}

let loading: Promise<PortOneSdk> | null = null;

export function loadPortOne() {
  if (typeof window === "undefined") return Promise.reject(new Error("브라우저에서만 쓴다"));
  if (window.PortOne) return Promise.resolve(window.PortOne);
  loading ??= new Promise<PortOneSdk>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.onload = () =>
      window.PortOne ? resolve(window.PortOne) : reject(new Error("포트원을 불러오지 못했다"));
    script.onerror = () => {
      loading = null;
      reject(new Error("포트원을 불러오지 못했다"));
    };
    document.head.append(script);
  });
  return loading;
}

// 인증 건 번호. KCP 는 40자 이내 영문·숫자만 받는다 (길면 "필수값 포멧 오류(ordr_idxx)" 로 창이 안 열린다)
export function newIdentityVerificationId() {
  return `iv${crypto.randomUUID().replaceAll("-", "")}`;
}

// 업체 창을 열어 본인인증을 받는다. 마치면 인증 건 번호, 창을 닫거나 실패하면 null
// ponytail: 휴대폰 브라우저는 창 대신 업체 화면으로 넘어갔다 돌아오는데(redirectUrl), 그 돌아올 화면은 아직 없다. 모바일 화면을 만들 때 더한다
export async function requestIdentityVerification(): Promise<string | null> {
  try {
    const portOne = await loadPortOne();
    const identityVerificationId = newIdentityVerificationId();
    const response = await portOne.requestIdentityVerification({
      storeId: env.portoneStoreId,
      identityVerificationId,
      channelKey: env.portoneChannelKey,
    });
    if (!response || response.code) return null;
    return response.identityVerificationId ?? identityVerificationId;
  } catch {
    return null;
  }
}
