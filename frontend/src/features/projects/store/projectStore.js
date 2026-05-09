import { create } from "zustand";
import axios from "../../../lib/axios";

export const useProjectStore = create((set, get) => ({
  projects: [],
  pagination: { currentPage: 1, lastPage: 1, total: 0 },
  isLoading: false,

  fetchProjects: async (params = { page: 1, search: "" }) => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/projects", { params });

      if (response.data.success) {
        set({
          projects: response.data.data || [],
          pagination: {
            currentPage: response.data.pagination?.currentPage || 1,
            lastPage: response.data.pagination?.lastPage || 1,
            total: response.data.pagination?.total || 0,
          },
          isLoading: false,
        });
      } else {
        set({ projects: [], isLoading: false });
      }
    } catch (error) {
      console.error("Fetch projects error:", error);
      set({
        projects: [],
        isLoading: false,
        pagination: { currentPage: 1, lastPage: 1, total: 0 },
      });
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
      const currentProjects = get().projects;
      set({
        projects: [response.data.data, ...currentProjects],
        pagination: {
          ...get().pagination,
          total: get().pagination.total + 1,
        },
      });
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
      set({
        projects: get().projects.map((p) =>
          p.id === id ? response.data.data : p,
        ),
      });
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
      set({
        projects: get().projects.map((p) =>
          p.id === id ? response.data.data : p,
        ),
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: "Gagal memproses status" };
    }
  },
}));
