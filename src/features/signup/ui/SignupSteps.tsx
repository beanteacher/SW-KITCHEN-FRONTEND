import { cn } from "@/shared/lib";

interface Props {
  names: string[];
  // 0 부터. 지난 단계·지금 단계는 검정 굵게
  current: number;
}

// 맨 위 단계 이름 줄
export default function SignupSteps({ names, current }: Props) {
  return (
    <ol className="mb-7 flex gap-1.5 text-xs text-[#aaa]">
      {names.map((name, index) => (
        <li
          key={name}
          aria-current={index === current ? "step" : undefined}
          className={cn(
            "flex-1 border-t-2 border-[#e0e0e0] pt-2",
            index <= current && "border-black font-semibold text-black",
          )}
        >
          {index + 1}. {name}
        </li>
      ))}
    </ol>
  );
}
