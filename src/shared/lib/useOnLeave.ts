"use client";

import { useEffect, useRef } from "react";

// 다른 화면으로 떠날 때 한 번 부른다. Next 는 떠난 화면을 지우지 않고 숨겨 두는데, 숨겨질 때 React 가 정리 함수를 부른다.
// 일부 값만 지울 때 화면 안에서 쓴다: useOnLeave(() => form.resetField("password")). 전체를 지우려면 FreshPage 로 감싼다
export function useOnLeave(onLeave: () => void) {
  const latest = useRef(onLeave);
  const leaving = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    latest.current = onLeave;
  });

  // 개발 모드는 처음 그릴 때 정리·다시 실행을 바로 이어서 한 번 더 한다. 그건 떠난 게 아니라서,
  // 정리 직후 다시 실행되면 부르지 않는다 (정말 떠난 경우는 다시 실행되지 않는다)
  useEffect(() => {
    clearTimeout(leaving.current);
    return () => {
      leaving.current = setTimeout(() => latest.current());
    };
  }, []);
}
