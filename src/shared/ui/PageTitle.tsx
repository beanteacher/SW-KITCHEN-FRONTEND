import { cn } from "@/shared/lib";

// 화면 맨 위 제목. 쇼핑몰은 크게, 관리자는 작게
const VARIANT_CLASS = {
  store: "text-2xl",
  admin: "text-lg",
};

interface Props {
  title: string;
  variant?: keyof typeof VARIANT_CLASS;
}

export default function PageTitle({ title, variant = "store" }: Props) {
  return <h1 className={cn("font-bold", VARIANT_CLASS[variant])}>{title}</h1>;
}
