"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { authKeys } from "@/features/auth";
import { MyInfo, MyPageTabs, useMyInfo, WithdrawDialog } from "@/features/my-page";
import { CustomerPasswordChangeForm } from "@/features/password-change";
import { ApiError } from "@/shared/api";
import { ErrorView, PageTitle, StatusView } from "@/shared/ui";

// 마이페이지 — 내 정보. 고객만 들어온다. 로그인 안 했으면 로그인 화면으로, 직원이면 관리 화면으로
export default function MyPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { data: me, error, isPending, refetch } = useMyInfo();
  // 소셜로만 가입한 고객이 탈퇴 전 소셜 로그인을 다시 하고 돌아오면 창을 다시 연다
  const backFromReauth = searchParams.get("withdraw") === "1";
  const reauthFailed = backFromReauth && searchParams.get("error") === "reauth";
  const [withdrawOpen, setWithdrawOpen] = useState(backFromReauth);

  const status = error instanceof ApiError ? error.status : null;
  useEffect(() => {
    if (status === 401) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    if (status === 403) router.replace("/admin/product");
  }, [status, router, pathname]);

  const renderBody = () => {
    if (isPending || status === 401 || status === 403) return <StatusView message="불러오는 중…" />;
    if (error) return <ErrorView message="정보를 불러오지 못했습니다." onRetry={() => refetch()} />;

    return (
      <>
        <MyInfo
          me={me}
          renderPasswordChange={(close) => (
            <CustomerPasswordChangeForm onDone={close} onCancel={close} />
          )}
        />
        <p className="mt-14 text-[13px] text-placeholder">
          더 이상 이용하지 않으려면{" "}
          <button type="button" className="underline" onClick={() => setWithdrawOpen(true)}>
            회원 탈퇴
          </button>
        </p>
        <WithdrawDialog
          open={withdrawOpen}
          onClose={() => {
            setWithdrawOpen(false);
            if (backFromReauth) router.replace(pathname);
          }}
          onDone={() => {
            router.replace("/withdrawn");
            // 내 데이터는 지우고, 내 정보만 다시 물어 머리글이 바로 [로그인 / 회원가입] 으로 바뀌게 한다.
            // 전부 지우기(clear)는 머리글이 보던 내 정보까지 떼어 내 다른 화면을 누를 때까지 [로그아웃] 이 남았다
            queryClient.removeQueries({
              predicate: (query) => query.queryKey[0] !== authKeys.all[0],
            });
            queryClient.resetQueries({ queryKey: authKeys.me() });
          }}
          hasPassword={Boolean(me.hasPassword)}
          provider={me.linkedProviders?.[0]}
          reauthenticated={backFromReauth && !reauthFailed}
          reauthFailed={reauthFailed}
        />
      </>
    );
  };

  return (
    // 가운데 860px. 좁으면 좌우 20px 만 남긴다
    <div className="mx-auto max-w-[860px] px-5 pt-10 pb-20">
      <div className="mb-[18px]">
        <PageTitle title="마이페이지" />
      </div>
      <MyPageTabs />
      {renderBody()}
    </div>
  );
}
