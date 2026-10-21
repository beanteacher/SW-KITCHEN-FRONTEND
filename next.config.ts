import type { NextConfig } from "next";

const apiServerUrl = process.env.API_SERVER_URL ?? "http://localhost:8080";
const imageBaseUrl = process.env.IMAGE_BASE_URL ?? "http://localhost:9000/sw-kitchen";

const nextConfig: NextConfig = {
  // 규칙은 상위 워크스페이스의 CLAUDE.md·.claude/rules 를 따른다. next dev 가 AGENTS.md 를 만들지 않게 끈다
  agentRules: false,
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // 브라우저는 Next 서버에만 요청하고, /api 요청은 백엔드로 넘긴다 (CORS 불필요)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiServerUrl}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [new URL(`${imageBaseUrl}/**`)],
    // 로컬 MinIO(localhost)는 사설 주소라 기본으로 막혀 있어서 개발 중에만 허용한다
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;
