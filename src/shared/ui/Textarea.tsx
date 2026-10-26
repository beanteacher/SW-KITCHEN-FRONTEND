import type { ComponentProps } from "react";
import { cn, FIELD_CLASS } from "@/shared/lib";

export default function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(FIELD_CLASS, "min-h-24 py-2", className)} {...props} />;
}
