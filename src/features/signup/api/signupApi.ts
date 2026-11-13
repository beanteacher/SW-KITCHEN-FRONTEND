import { apiRequest } from "@/shared/api";
import type { SignupDto } from "../model/dto/signupDto";

export * as SignupApi from "./signupApi";

const BASE_URL = "member";

export const checkUserId = (userId: string) =>
  apiRequest<SignupDto.UserIdCheck>(`${BASE_URL}/user-id-check`, { searchParams: { userId } });

// 가입하면 바로 로그인된다 (서버가 토큰 쿠키를 준다)
export const signup = (data: SignupDto.SignupForm) =>
  apiRequest<SignupDto.LoginResult>(BASE_URL, { method: "post", json: data });

export const socialSignup = (agreements: SignupDto.Agreements) =>
  apiRequest<SignupDto.LoginResult>(`${BASE_URL}/social`, { method: "post", json: { agreements } });

// 같은 사람의 기존 계정에 이 소셜을 잇고 로그인한다. 아이디 가입 계정이면 그 비밀번호가 필요하다
export const socialLink = (password?: string) =>
  apiRequest<SignupDto.LoginResult>(`${BASE_URL}/social/link`, {
    method: "post",
    json: { password },
  });
