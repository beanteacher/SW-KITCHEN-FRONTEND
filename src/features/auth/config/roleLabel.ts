import type { AuthDto } from "../model/dto/authDto";

export const ROLE_LABEL: Record<AuthDto.Role, string> = {
  CUSTOMER: "고객",
  STAFF: "담당자",
  ADMIN: "관리자",
};
