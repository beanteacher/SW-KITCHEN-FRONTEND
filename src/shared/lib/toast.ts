import { create } from "zustand";

export type ToastKind = "success" | "error";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastState {
  items: ToastItem[];
  remove: (id: number) => void;
}

const TOAST_DURATION_MS = 3000;

export const useToastStore = create<ToastState>()((set) => ({
  items: [],
  remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
}));

let nextId = 1;

// 화면 오른쪽 위에 3초 동안 메시지를 띄운다
export function toast(message: string, kind: ToastKind = "success") {
  const id = nextId++;
  useToastStore.setState((state) => ({ items: [...state.items, { id, kind, message }] }));
  setTimeout(() => useToastStore.getState().remove(id), TOAST_DURATION_MS);
}
