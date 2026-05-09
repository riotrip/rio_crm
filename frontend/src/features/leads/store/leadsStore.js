    import { create } from 'zustand';
import axios from '../../../lib/axios';

export const useLeadsStore = create((set) => ({
  leads: [],
  stats: { total: 0, deal: 0, customer: 0 }, 
  isLoading: false,

  fetchLeads: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('/leads');
      const data = response.data.data;
      
      set({ 
        leads: data, 
        stats: {
          total: data.length,
          deal: data.filter(l => l.status === 'deal').length,
          customer: data.filter(l => l.status === 'qualified').length,
        },
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addLead: async (leadData) => {
    try {
      const response = await axios.post('/leads', leadData);
      const newLead = response.data.data;
      
      set((state) => ({
        leads: [newLead, ...state.leads]
      }));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Gagal menambah lead' 
      };
    }
  }
}));