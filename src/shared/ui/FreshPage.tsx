"use client";

import { Fragment, useState, type ReactNode } from "react";
import { useOnLeave } from "@/shared/lib";

interface Props {
  children: ReactNode;
}

// 다른 화면에 다녀오면 처음 들어온 새 페이지처럼 보이게 안의 단계·입력을 전부 처음으로 되돌린다 (데이터를 다시 받지는 않는다).
// 끝난 단계나 찾은 아이디·입력한 비밀번호가 남으면 안 되는 화면에 쓴다. 일부 값만 지우려면 화면 안에서 useOnLeave 를 쓴다
export default function FreshPage({ children }: Props) {
  const [visit, setVisit] = useState(0);

  // key 가 바뀌면 React 가 안쪽을 버리고 새로 만든다
  useOnLeave(() => setVisit((count) => count + 1));

  return <Fragment key={visit}>{children}</Fragment>;
}
