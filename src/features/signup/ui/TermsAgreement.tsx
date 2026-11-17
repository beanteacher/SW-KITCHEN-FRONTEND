"use client";

import { useState } from "react";
import { Dialog } from "@/shared/ui";
import type { SignupDto } from "../model/dto/signupDto";

const ITEMS: { key: keyof SignupDto.Agreements; label: string }[] = [
  { key: "terms", label: "이용약관 동의 (필수)" },
  { key: "privacy", label: "개인정보 수집·이용 동의 (필수)" },
  { key: "marketing", label: "마케팅 정보 수신 동의 (선택)" },
];

interface Props {
  value: SignupDto.Agreements;
  onChange: (value: SignupDto.Agreements) => void;
}

const CHECK_CLASS = "size-4 accent-black";

// 약관 동의 (무신사 가입 실측: 줄 34px 13px #666, 체크 16px, [자세히] 밑줄)
export default function TermsAgreement({ value, onChange }: Props) {
  const [detail, setDetail] = useState<string | null>(null);
  const all = ITEMS.every((item) => value[item.key]);

  return (
    <div>
      <h3 className="mb-3.5 text-sm font-medium">약관 동의</h3>
      <label className="mb-1.5 flex min-h-[34px] cursor-pointer items-center gap-2 border-b border-[#f1f1f1] pb-1.5 text-[13px] font-medium">
        <input
          type="checkbox"
          className={CHECK_CLASS}
          checked={all}
          onChange={(event) =>
            onChange({
              terms: event.target.checked,
              privacy: event.target.checked,
              marketing: event.target.checked,
            })
          }
        />
        약관 전체 동의하기 (선택 동의 포함)
      </label>
      {ITEMS.map((item) => (
        <div
          key={item.key}
          className="flex min-h-[34px] items-center gap-2 pl-6 text-[13px] text-[#666]"
        >
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className={CHECK_CLASS}
              checked={value[item.key]}
              onChange={(event) => onChange({ ...value, [item.key]: event.target.checked })}
            />
            {item.label}
          </label>
          <button type="button" className="ml-auto underline" onClick={() => setDetail(item.label)}>
            자세히
          </button>
        </div>
      ))}
      <ul className="mt-5 list-disc border-t border-[#f1f1f1] pt-4 pl-3.5 text-[13px] leading-5 text-[#666]">
        <li>선택 항목에 동의하지 않아도 가입할 수 있습니다.</li>
        <li>만 14세 미만은 가입할 수 없습니다. 다음 단계의 본인확인으로 확인합니다.</li>
      </ul>
      <Dialog
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail ?? ""}
        actions={
          <button
            type="button"
            className="h-9 rounded-[4px] bg-black px-4 text-sm text-white"
            onClick={() => setDetail(null)}
          >
            확인
          </button>
        }
      >
        {/* ponytail: 약관 본문은 고객센터 기능(B2-support)에서 정한다. 그때 이 창에 본문을 넣는다 */}
        약관 본문을 준비하고 있습니다.
      </Dialog>
    </div>
  );
}

export const REQUIRED_AGREED = (value: SignupDto.Agreements) => value.terms && value.privacy;
