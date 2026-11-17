"use client";

import { useState, type ReactNode } from "react";
import { type MemberDto, useStaffList } from "@/entities/member";
import { ApiError } from "@/shared/api";
import { cn, formatDate, toast } from "@/shared/lib";
import { AlertDialog } from "@/shared/ui";
import {
  AdminButton,
  AdminErrorNotice,
  AdminPageHeader,
  AdminSelect,
  AdminTable,
  AdminTd,
  AdminTh,
} from "@/shared/ui/admin";
import { useUpdateStaff } from "../model/useStaffAdminActions";
import StaffAddDialog from "./StaffAddDialog";
import StaffPasswordDialog from "./StaffPasswordDialog";

const ROLE_OPTIONS = [
  { value: "STAFF" as const, label: "담당자" },
  { value: "ADMIN" as const, label: "관리자" },
];
const ROLE_LABEL: Record<MemberDto.StaffRole, string> = { STAFF: "담당자", ADMIN: "관리자" };

interface Props {
  // 로그인한 관리자. 자기 줄은 정지·역할 바꾸기를 숨긴다
  myId: number;
}

// 직원 계정 관리: 제목 줄 + 표 + 창들. 직원 계정은 지우지 않고 정지한다
export default function StaffManager({ myId }: Props) {
  const { data: staffList, isPending, isError, refetch } = useStaffList();
  const { mutate: update } = useUpdateStaff();
  const [adding, setAdding] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState<MemberDto.Staff | null>(null);
  const [suspendTarget, setSuspendTarget] = useState<MemberDto.Staff | null>(null);
  const [blocked, setBlocked] = useState(false);
  // 역할·정지를 바꾸다 서버 오류로 실패하면 표 위에 남긴다
  const [updateError, setUpdateError] = useState<string | null>(null);

  const handleUpdate = (data: Parameters<typeof update>[0], done: string) => {
    setUpdateError(null);
    update(data, {
      onSuccess: () => toast(done),
      onError: (error) => {
        if (error instanceof ApiError && error.code === "SELF_CHANGE_NOT_ALLOWED") {
          setBlocked(true);
          return;
        }
        setUpdateError(error.message);
      },
    });
  };

  const handleSuspend = () => {
    if (!suspendTarget) return;
    handleUpdate(
      { id: suspendTarget.id, status: "SUSPENDED" },
      `${suspendTarget.userId} 계정을 정지했습니다.`,
    );
    setSuspendTarget(null);
  };

  const renderRows = () => {
    if (isError) {
      return (
        <EmptyRow>
          목록을 불러오지 못했습니다.{" "}
          <AdminButton variant="outline" size="compact" onClick={() => refetch()}>
            다시 시도
          </AdminButton>
        </EmptyRow>
      );
    }
    if (isPending) return <EmptyRow>불러오는 중…</EmptyRow>;

    return staffList.map((staff, index) => {
      const self = staff.id === myId;
      const suspended = staff.status === "SUSPENDED";
      return (
        <tr key={staff.id} className={cn(suspended && "text-admin-muted")}>
          <AdminTd>{index + 1}</AdminTd>
          <AdminTd className="text-left">
            {staff.userId}
            {self && <span className="ml-1 text-admin-muted">(나)</span>}
          </AdminTd>
          <AdminTd>{staff.name}</AdminTd>
          <AdminTd>
            {self || !staff.role ? (
              staff.role && (
                <span className="inline-block border border-ink px-1.5 text-xs leading-5 font-bold text-ink">
                  {ROLE_LABEL[staff.role]}
                </span>
              )
            ) : (
              <AdminSelect
                size="sm"
                aria-label={`${staff.userId} 역할`}
                className="mx-auto w-[100px]"
                options={ROLE_OPTIONS}
                value={staff.role}
                onChange={(role) =>
                  handleUpdate(
                    { id: staff.id, role },
                    `역할을 ${ROLE_LABEL[role]}(으)로 바꿨습니다.`,
                  )
                }
              />
            )}
          </AdminTd>
          <AdminTd className={cn("font-semibold", suspended && "text-admin-error")}>
            {suspended ? "정지" : "사용 중"}
          </AdminTd>
          <AdminTd>{staff.createdAt && formatDate(staff.createdAt)}</AdminTd>
          <AdminTd className="whitespace-nowrap">
            {self ? (
              <span className="text-admin-muted">—</span>
            ) : (
              <span className="inline-flex gap-1">
                <AdminButton
                  variant="outline"
                  size="compact"
                  onClick={() => setPasswordTarget(staff)}
                >
                  비밀번호 변경하기
                </AdminButton>
                {suspended ? (
                  <AdminButton
                    variant="outline"
                    size="compact"
                    onClick={() =>
                      handleUpdate(
                        { id: staff.id, status: "ACTIVE" },
                        `${staff.userId} 계정의 정지를 풀었습니다.`,
                      )
                    }
                  >
                    정지 해제
                  </AdminButton>
                ) : (
                  <AdminButton
                    variant="danger"
                    size="compact"
                    onClick={() => setSuspendTarget(staff)}
                  >
                    정지
                  </AdminButton>
                )}
              </span>
            )}
          </AdminTd>
        </tr>
      );
    });
  };

  return (
    <>
      <AdminPageHeader
        title="직원 계정"
        sub="직원 계정은 지우지 않고 정지합니다."
        action={<AdminButton onClick={() => setAdding(true)}>+ 직원 추가</AdminButton>}
      />
      {updateError && <AdminErrorNotice className="mb-3">{updateError}</AdminErrorNotice>}
      <AdminTable>
        <table className="w-full table-fixed border-collapse text-[13px]">
          <colgroup>
            {/* 1024px 에서도 넘치지 않게 칸 너비를 정해 둔다. 아이디·이름이 남는 폭을 나눈다 */}
            <col className="w-[60px]" />
            <col />
            <col />
            <col className="w-[112px]" />
            <col className="w-20" />
            <col className="w-[104px]" />
            <col className="w-[236px]" />
          </colgroup>
          <thead>
            <tr>
              <AdminTh>번호</AdminTh>
              <AdminTh>아이디</AdminTh>
              <AdminTh>이름</AdminTh>
              <AdminTh>역할</AdminTh>
              <AdminTh>상태</AdminTh>
              <AdminTh>만든 날</AdminTh>
              <AdminTh>관리</AdminTh>
            </tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </table>
      </AdminTable>
      <p className="mt-2 text-xs text-admin-muted">
        역할은 고르면 바로 바뀝니다. 정지하거나 비밀번호를 바꾸면 그 직원은 모든 기기에서
        로그아웃됩니다. 내 비밀번호는 위 [비밀번호 변경]에서 바꿉니다.
      </p>

      <StaffAddDialog open={adding} onClose={() => setAdding(false)} />
      <StaffPasswordDialog staff={passwordTarget} onClose={() => setPasswordTarget(null)} />
      <AlertDialog
        open={suspendTarget !== null}
        kind="confirm"
        title="정지할까요?"
        confirmLabel="정지"
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleSuspend}
      >
        <b className="text-ink">
          {suspendTarget?.userId} ({suspendTarget?.name})
        </b>{" "}
        계정을 정지합니다. 바로 로그인할 수 없고 쓰고 있던 기기도 곧 로그아웃됩니다. 정지 해제로
        되돌릴 수 있습니다.
      </AlertDialog>
      <AlertDialog
        open={blocked}
        kind="warning"
        title="바꿀 수 없음"
        onClose={() => setBlocked(false)}
      >
        자기 계정은 정지하거나 역할을 바꿀 수 없습니다.
      </AlertDialog>
    </>
  );
}

function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <tr>
      <td colSpan={7} role="status" className="py-16 text-center text-admin-sub">
        {children}
      </td>
    </tr>
  );
}
