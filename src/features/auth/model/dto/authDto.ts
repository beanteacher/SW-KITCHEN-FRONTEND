export * as AuthDto from "./authDto";

export type Role = "CUSTOMER" | "STAFF" | "ADMIN";

export interface Me {
  id: number;
  userId?: string;
  role?: Role;
}

export interface LoginForm {
  userId: string;
  password: string;
}

export interface LoginResult extends Me {
  // 처음 받은 비밀번호 그대로 로그인했으면 true. 바꾸라는 안내만 하고 막지는 않는다
  passwordChangeRecommended?: boolean;
}
