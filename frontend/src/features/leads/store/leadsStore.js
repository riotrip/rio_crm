import { create } from "zustand";
import axios from "../../../lib/axios";

export const useLeadsStore = create((set) => ({
  leads: [],
  stats: { total: 0, deal: 0, customer: 0 },
  pagination: { currentPage: 1, lastPage: 1, total: 0 }, 
  isLoading: false,

  fetchLeads: async (params = { page: 1, search: "", status: "" }) => {
    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`/leads?${queryParams}`);

      const payload = response.data;

      set({
        leads: payload.data.data,
        stats: payload.stats, 
        pagination: {
          currentPage: payload.data.current_page,
          lastPage: payload.data.last_page,
          total: payload.data.total,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  addLead: async (leadData) => {
    try {
      const response = await axios.post("/leads", leadData);
      const newLead = response.data.data;

      set((state) => ({
        leads: [newLead, ...state.leads],
        stats: {
          ...state.stats,
          total: (state.stats?.total || 0) + 1,
        },
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal menambah lead",
      };
    }
  },

  editLead: async (id, formData) => {
    try {
      const response = await axios.put(`/leads/${id}`, formData);
      set((state) => {
        const updatedLeads = state.leads.map((lead) =>
          lead.id === id ? response.data.data : lead,
        );
        return { leads: updatedLeads };
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal mengedit data",
      };
    }
  },

  deleteLead: async (id) => {
    try {
      await axios.delete(`/leads/${id}`);
      set((state) => {
        const updatedLeads = state.leads.filter((lead) => lead.id !== id);
        return {
          leads: updatedLeads,
          stats: {
            total: updatedLeads.length,
            deal: updatedLeads.filter((l) => l.status === "deal").length,
            customer: updatedLeads.filter((l) => l.status === "qualified")
              .length,
          },
        };
      });
    } catch (error) {
      console.error("Gagal menghapus leads:", error);
    }
  },
}));
