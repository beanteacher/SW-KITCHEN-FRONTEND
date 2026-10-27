import { useId, type ReactNode } from "react";
import AdminFieldError from "./AdminFieldError";

interface FieldControlProps {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
}

interface Props {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: (control: FieldControlProps) => ReactNode;
}

// 관리자 폼 한 줄: 왼쪽 회색 이름 칸 + 오른쪽 입력칸, 오류는 입력칸 아래 빨간 글씨
export default function AdminFormField({ label, required, error, hint, children }: Props) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className="flex border-b border-line text-[13px]">
      <label htmlFor={id} className="w-[140px] shrink-0 bg-gray-50 px-3 py-2.5 font-bold">
        {label}
        {required && (
          <span className="ml-0.5 text-danger" aria-hidden>
            *
          </span>
        )}
      </label>
      <div className="flex-1 px-3 py-2">
        {children({
          id,
          "aria-invalid": Boolean(error),
          "aria-describedby": message ? messageId : undefined,
        })}
        {error && <AdminFieldError id={messageId}>{error}</AdminFieldError>}
        {!error && hint && (
          <p id={messageId} className="mt-1 text-xs text-gray-500">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
