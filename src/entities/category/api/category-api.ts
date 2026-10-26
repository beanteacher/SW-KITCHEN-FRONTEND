import { apiRequest } from "@/shared/api";
import type { AdminCategory } from "../model/types";

export const categoryKeys = {
  all: ["category"] as const,
  adminTree: () => [...categoryKeys.all, "admin-tree"] as const,
};

export function getAdminCategories() {
  return apiRequest<AdminCategory[]>("admin/category");
}
