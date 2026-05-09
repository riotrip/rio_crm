import { create } from "zustand";
import axios from "../../../lib/axios";

export const useDashboardStore = create((set) => ({
  stats: { total: 0, deal: 0, customer: 0 },
  isLoading: false,

  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/dashboard/stats");
      set({
        stats: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      console.error("Gagal mengambil data statistik:", error);
      set({ isLoading: false });
    }
  },
}));
