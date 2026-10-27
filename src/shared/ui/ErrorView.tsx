import AdminButton from "./admin/AdminButton";
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
      // ponytail: 사용자 화면 버튼 부품이 아직 없어 여기만 직접 그린다. 쇼핑몰 화면을 만들 때 Button 으로 바꾼다
      <button
        type="button"
        onClick={onRetry}
        className="h-9 rounded-md border border-line bg-white px-4 text-sm hover:bg-gray-50"
      >
        다시 시도
      </button>
    );

  return <StatusView message={message} action={retryButton} />;
}
