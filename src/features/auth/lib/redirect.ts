import type { Role } from "../api/auth-api";

// 로그인 뒤 갈 곳. 이 사이트 안 주소만 받고, 바깥 주소(//, http:)는 무시해 다른 사이트로 보내는 공격을 막는다
export function getAfterLoginPath(redirect: string | null, role: Role) {
  if (
    redirect &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//") &&
    !redirect.startsWith("/\\")
  ) {
    return redirect;
  }
  // / 와 /admin 은 다시 넘겨주기만 하므로 처음부터 첫 화면으로 보내 이동을 한 번으로 줄인다
  return role === "CUSTOMER" ? "/product/new" : "/admin/product";
}
