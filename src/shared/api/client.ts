import ky, { type AfterResponseHook, type Options } from "ky";
import { env } from "@/shared/config";
import { toApiError } from "./errors";
import type { ApiResponse } from "./types";

const isBrowser = typeof window !== "undefined";

// 브라우저는 같은 출처의 /api 로 보내고(Next 가 백엔드로 넘김), 서버 렌더링 때는 백엔드로 바로 보낸다
const prefix = isBrowser ? "/api/v1" : `${env.apiServerUrl}/api/v1`;

type AuthFailureHandler = (status: 401 | 403) => void;

let authFailureHandler: AuthFailureHandler | null = null;

// 로그인이 풀렸거나 권한이 없을 때 어떻게 할지 화면 쪽에서 정한다
export function setAuthFailureHandler(handler: AuthFailureHandler | null) {
  authFailureHandler = handler;
}

const NO_REFRESH_PATHS = ["/auth/login", "/auth/refresh", "/auth/logout"];

let refreshing: Promise<boolean> | null = null;

// 동시에 여러 요청이 401 을 받아도 토큰 재발급은 한 번만 한다
function refreshOnce() {
  refreshing ??= ky
    .post(`${prefix}/auth/refresh`, { credentials: "include", retry: 0 })
    .then(() => true)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

const handleAuthResponse: AfterResponseHook = async ({ request, response, retryCount }) => {
  if (!isBrowser) return;

  if (response.status === 403) {
    authFailureHandler?.(403);
    return;
  }
  if (response.status !== 401) return;

  const pathname = new URL(request.url).pathname;
  const skipRefresh = NO_REFRESH_PATHS.some((path) => pathname.endsWith(path));
  if (skipRefresh || retryCount > 0) {
    authFailureHandler?.(401);
    return;
  }

  const refreshed = await refreshOnce();
  if (refreshed) return ky.retry();

  authFailureHandler?.(401);
};

export const http = ky.create({
  prefix,
  credentials: "include",
  // 업로드 등 서버가 요구하는 헤더라 모든 요청에 붙인다
  headers: { "X-Requested-With": "XMLHttpRequest" },
  // 재시도는 401 뒤 토큰 재발급 후 한 번만 한다
  retry: { limit: 1, methods: [] },
  hooks: { afterResponse: [handleAuthResponse] },
});

// 성공 응답에서 data 만 꺼내 주고, 실패는 ApiError 로 바꿔서 던진다
export async function apiRequest<T>(path: string, options?: Options): Promise<T> {
  try {
    const response = await http(path, options);
    if (response.status === 204) return undefined as T;
    const body = await response.json<ApiResponse<T>>();
    return body.data;
  } catch (error) {
    throw toApiError(error);
  }
}
