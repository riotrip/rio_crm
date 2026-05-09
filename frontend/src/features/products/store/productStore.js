import { create } from "zustand";
import axios from "../../../lib/axios";

export const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  pagination: { currentPage: 1, lastPage: 1, total: 0 },

  fetchProducts: async (params = { page: 1, search: "", all: false }) => {
    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`/products?${queryParams}`);
      const result = response.data.data;

      set({
        products: params.all ? result : result.data,
        pagination: !params.all
          ? {
              currentPage: result.current_page,
              lastPage: result.last_page,
              total: result.total,
            }
          : get().pagination,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  toggleStatus: async (id) => {
    try {
      const response = await axios.patch(`/products/${id}/toggle`);
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? response.data.data : p,
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));
