import { Check } from "lucide-react";
import { cn } from "@/shared/lib";
import { CUSTOMER_PASSWORD_RULES } from "../lib/customerPassword";

// 비밀번호 칸 아래 규칙 4개. 입력하는 대로 맞춘 규칙이 초록 ✓ 로 바뀐다
export default function PasswordRules({ value }: { value: string }) {
  return (
    <ul className="mx-0.5 mt-1.5 flex gap-2.5 text-[11px] text-[#aaa]" aria-label="비밀번호 규칙">
      {CUSTOMER_PASSWORD_RULES.map((rule) => {
        const passed = rule.test(value);
        return (
          <li
            key={rule.label}
            className={cn("flex items-center gap-0.5", passed && "text-success")}
          >
            <Check className="size-3" strokeWidth={2} aria-hidden />
            {rule.label}
            <span className="sr-only">{passed ? " 맞음" : " 아직"}</span>
          </li>
        );
      })}
    </ul>
  );
}
