export * as SignupDto from "./signupDto";

export interface Agreements {
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
}

export interface SignupForm {
  userId: string;
  password: string;
  agreements: Agreements;
}

export interface LoginResult {
  id: number;
  userId?: string | null;
  name?: string;
}
