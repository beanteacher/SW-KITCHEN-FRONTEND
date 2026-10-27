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
  hint?: ReactNode;
  children: (control: FieldControlProps) => ReactNode;
}

// 관리자 폼 한 줄: 왼쪽 회색 이름 칸(140px) + 오른쪽 입력칸. AdminTable 틀 안에 차례로 쌓는다
export default function AdminFormField({ label, required, error, hint, children }: Props) {
  const id = useId();
  const messageId = `${id}-message`;

  return (
    <div className="flex border-b border-admin-head-line text-[13px] last:border-b-0">
      <label
        htmlFor={id}
        className="w-[140px] shrink-0 bg-admin-fill px-4 py-2 leading-8 font-semibold text-admin-text"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-admin-error" aria-hidden>
            *
          </span>
        )}
      </label>
      <div className="min-w-0 flex-1 px-3 py-2">
        {children({
          id,
          "aria-invalid": Boolean(error),
          "aria-describedby": error ? messageId : undefined,
        })}
        {error && <AdminFieldError id={messageId}>{error}</AdminFieldError>}
        {hint}
      </div>
    </div>
  );
}
