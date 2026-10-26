import Button from "./Button";
import StatusView from "./StatusView";

// 쇼핑몰은 기본 버튼, 관리자는 작은 버튼
const BUTTON_SIZE = {
  store: "md",
  admin: "sm",
} as const;

interface Props {
  message: string;
  onRetry: () => void;
  variant?: keyof typeof BUTTON_SIZE;
}

// 불러오지 못했을 때 영역 가운데에 문구와 [다시 시도] 를 띄운다
export default function ErrorView({ message, onRetry, variant = "store" }: Props) {
  const retryButton = (
    <Button size={BUTTON_SIZE[variant]} variant="outline" onClick={onRetry}>
      다시 시도
    </Button>
  );

  return <StatusView message={message} action={retryButton} />;
}
