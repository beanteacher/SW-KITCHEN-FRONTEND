import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

// 위 계층은 아래 계층만 가져다 쓸 수 있다: app → widgets → features → entities → shared
const layerZones = [
  {
    target: "./src/shared",
    from: ["./src/entities", "./src/features", "./src/widgets", "./src/app"],
  },
  { target: "./src/entities", from: ["./src/features", "./src/widgets", "./src/app"] },
  { target: "./src/features", from: ["./src/widgets", "./src/app"] },
  { target: "./src/widgets", from: ["./src/app"] },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      "import/no-restricted-paths": ["error", { zones: layerZones }],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
