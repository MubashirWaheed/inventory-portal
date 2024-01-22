import { create } from "zustand";

interface SidebarStore {
  display: boolean;
  setDisplay: () => void;
  isOpen: boolean;
  toggle: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  display: true,
  setDisplay: () => set((state) => ({ display: !state.display })),
  isOpen: true,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
