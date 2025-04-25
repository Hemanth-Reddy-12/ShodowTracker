import { create } from "zustand";

const usePageStore = create((set) => ({
  currentPage: "/",
  sidebarToggle: false,
  setCurrentPage: (page) => set({ currentPage: page }),
  toggleSidebar: (toggle) => set({ sidebarToggle: toggle }),
}));

export default usePageStore;
