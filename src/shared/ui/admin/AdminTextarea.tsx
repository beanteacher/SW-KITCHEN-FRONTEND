import type { ComponentProps } from "react";
import { cn } from "@/shared/lib";
import { ADMIN_FIELD_CLASS } from "./AdminInput";

export default function AdminTextarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea className={cn(ADMIN_FIELD_CLASS, "min-h-24 px-2.5 py-2", className)} {...props} />
  );
}
