import AdminButton from "./admin/AdminButton";
import Button from "./Button";
import StatusView from "./StatusView";

interface Props {
  message: string;
  onRetry: () => void;
  variant?: "store" | "admin";
}

// 불러오지 못했을 때 영역 가운데에 문구와 [다시 시도] 를 띄운다
export default function ErrorView({ message, onRetry, variant = "store" }: Props) {
  const retryButton =
    variant === "admin" ? (
      <AdminButton variant="outline" onClick={onRetry}>
        다시 시도
      </AdminButton>
    ) : (
      <Button onClick={onRetry}>다시 시도</Button>
    );

  return <StatusView message={message} action={retryButton} />;
}
