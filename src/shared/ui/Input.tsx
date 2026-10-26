import type { ComponentProps } from "react";
import { cn, FIELD_CLASS } from "@/shared/lib";

export default function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(FIELD_CLASS, "h-8", className)} {...props} />;
}
