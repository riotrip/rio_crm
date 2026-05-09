import { create } from "zustand";
import axios from "../../../lib/axios";

export const useCustomerStore = create((set) => ({
  customers: [],
  pagination: { currentPage: 1, lastPage: 1, total: 0 },
  isLoading: false,

  fetchCustomers: async (params = { page: 1, search: "" }) => {
    set({ isLoading: true });
    try {
      const response = await axios.get("/customers", { params });
      set({
        customers: response.data.data.data || [],
        pagination: {
          currentPage: response.data.data.current_page,
          lastPage: response.data.data.last_page,
          total: response.data.data.total,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ customers: [], isLoading: false });
    }
  },

  fetchCustomerDetail: async (id) => {
    try {
      const response = await axios.get(`/customers/${id}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: "Gagal memuat detail" };
    }
  },
}));
