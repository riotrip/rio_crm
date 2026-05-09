import { create } from "zustand";
import axios from "../../../lib/axios";

export const useLeadsStore = create((set, get) => ({
  leads: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    total: 0,
  },
  isLoading: false,

  fetchLeads: async (params = { page: 1, search: "" }) => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/leads", { params });
      const { data, current_page, last_page, total } = response.data.data;

      set({
        leads: data,
        pagination: {
          currentPage: current_page,
          lastPage: last_page,
          total: total,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error("Fetch Leads Error:", error);
      set({ isLoading: false });
    }
  },

  createLead: async (formData) => {
    try {
      const response = await axios.post("/leads", formData);
      const newLead = response.data.data;

      set((state) => ({
        leads: [newLead, ...state.leads],
        pagination: { ...state.pagination, total: state.pagination.total + 1 },
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal menambah data lead",
      };
    }
  },

  updateLead: async (id, formData) => {
    try {
      const response = await axios.put(`/leads/${id}`, formData);
      const updatedLead = response.data.data;

      set((state) => ({
        leads: state.leads.map((l) => (l.id === id ? updatedLead : l)),
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal memperbarui data",
      };
    }
  },

  deleteLead: async (id) => {
    try {
      await axios.delete(`/leads/${id}`);
      set((state) => ({
        leads: state.leads.filter((l) => l.id !== id),
        pagination: { ...state.pagination, total: state.pagination.total - 1 },
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: "Gagal menghapus data" };
    }
  },
}));
