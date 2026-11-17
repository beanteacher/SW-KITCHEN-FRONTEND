import { apiRequest } from "@/shared/api";
import type { MemberDto } from "@/entities/member";
import type { StaffSchema } from "../model/schema/staffSchema";

export * as StaffAdminApi from "./staffAdminApi";

const BASE_URL = "admin/staff";

export const create = ({ userId, name, role, password }: StaffSchema.CreateFormValues) =>
  apiRequest<MemberDto.Staff>(BASE_URL, { method: "post", json: { userId, name, role, password } });

// 보낸 값만 바뀐다
export const update = (
  id: number,
  data: { role?: MemberDto.StaffRole; status?: MemberDto.AccountStatus },
) => apiRequest<MemberDto.Staff>(`${BASE_URL}/${id}`, { method: "patch", json: data });

export const resetPassword = (id: number, password: string) =>
  apiRequest<void>(`${BASE_URL}/${id}/password`, { method: "put", json: { password } });
