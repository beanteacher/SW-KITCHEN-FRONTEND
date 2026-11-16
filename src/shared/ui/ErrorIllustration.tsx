// 오류 화면 그림. not-found 는 문이 열린 빈 냉장고, error 는 끓어 넘치는 냄비
// ponytail: 자리 표시용으로 그린 그림이다. 로고·브랜드 색이 정해지면 같이 다듬는다
export default function ErrorIllustration({ kind }: { kind: "not-found" | "error" }) {
  return kind === "not-found" ? (
    <svg viewBox="0 0 220 170" fill="none" aria-hidden className="mx-auto h-[116px] w-[150px]">
      <ellipse cx="110" cy="158" rx="78" ry="7" fill="#efe6db" />
      <rect
        x="62"
        y="14"
        width="80"
        height="140"
        rx="8"
        fill="#fff"
        stroke="#3b3631"
        strokeWidth="3"
      />
      <rect
        x="70"
        y="24"
        width="64"
        height="118"
        rx="4"
        fill="#f4f7fa"
        stroke="#3b3631"
        strokeWidth="2"
      />
      <path d="M70 62h64M70 100h64" stroke="#c9d3dc" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M142 18l40 12v116l-40 8"
        fill="#fff"
        stroke="#3b3631"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M150 70v26" stroke="#3b3631" strokeWidth="4" strokeLinecap="round" />
      <path d="M150 110h22M150 124h22" stroke="#e7dccf" strokeWidth="3" strokeLinecap="round" />
      <text
        x="102"
        y="92"
        textAnchor="middle"
        fontSize="30"
        fontWeight="800"
        fill="#e8a25b"
        fontFamily="inherit"
      >
        ?
      </text>
      <path
        d="M40 40c-6-4-6-10 0-14M30 52c-6-4-6-10 0-14"
        stroke="#c9d3dc"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 220 170" fill="none" aria-hidden className="mx-auto h-[116px] w-[150px]">
      <ellipse cx="110" cy="158" rx="80" ry="7" fill="#efe6db" />
      <path
        d="M52 92h116v42a18 18 0 0 1-18 18H70a18 18 0 0 1-18-18z"
        fill="#fff"
        stroke="#3b3631"
        strokeWidth="3"
      />
      <path d="M52 104H36M168 104h16" stroke="#3b3631" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M58 94c10 12 20 12 30 0s20-12 30 0 20 12 30 0 14-8 20-2"
        fill="#f6d9b8"
        stroke="#e8a25b"
        strokeWidth="2.5"
      />
      <g transform="rotate(-12 110 78)">
        <rect
          x="54"
          y="74"
          width="112"
          height="10"
          rx="5"
          fill="#fff"
          stroke="#3b3631"
          strokeWidth="3"
        />
        <rect x="100" y="64" width="20" height="10" rx="4" fill="#3b3631" />
      </g>
      <path
        d="M80 52c-8-8 8-12 0-22M110 46c-8-8 8-12 0-22M140 52c-8-8 8-12 0-22"
        stroke="#c9d3dc"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="44" cy="128" r="4" fill="#f6d9b8" />
      <circle cx="178" cy="132" r="3" fill="#f6d9b8" />
    </svg>
  );
}
