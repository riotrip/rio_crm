import { create } from "zustand";
import axios from "../../../lib/axios";

export const useProjectStore = create((set) => ({
  projects: [],
  pagination: { currentPage: 1, lastPage: 1, total: 0 },
  isLoading: false,

  fetchProjects: async (params = { page: 1, search: "" }) => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/projects", { params });
      set({
        projects: response.data.data.data || [],
        pagination: {
          currentPage: response.data.data.current_page,
          lastPage: response.data.data.last_page,
          total: response.data.data.total,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ projects: [], isLoading: false }); 
    }
  },

  fetchProjectDetail: async (id) => {
    try {
      const response = await axios.get(`/projects/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: "Gagal memuat detail" };
    }
  },

  createProject: async (formData) => {
    try {
      const response = await axios.post("/projects", formData);
      set((state) => ({
        projects: [response.data.data, ...state.projects],
        pagination: { ...state.pagination, total: state.pagination.total + 1 },
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal membuat",
      };
    }
  },

  updateProject: async (id, formData) => {
    try {
      const response = await axios.put(`/projects/${id}`, formData);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? response.data.data : p,
        ),
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal update",
      };
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await axios.put(`/projects/${id}`, { status });
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === id ? response.data.data : p,
        ),
      }));
      return { success: true };
    } catch (error) {
      return { success: false, message: "Gagal memproses status" };
    }
  },
}));
