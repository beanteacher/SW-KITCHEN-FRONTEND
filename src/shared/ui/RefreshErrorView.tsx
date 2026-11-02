"use client";

import { useRouter } from "next/navigation";
import ErrorView from "./ErrorView";

interface Props {
  message: string;
}

// 서버에서 그리다 못 불러왔을 때. [다시 시도]는 이 화면을 서버에서 다시 그린다
export default function RefreshErrorView({ message }: Props) {
  const router = useRouter();
  return <ErrorView message={message} onRetry={() => router.refresh()} />;
}
