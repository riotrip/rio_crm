import { create } from 'zustand';
import axios from '../../../lib/axios';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('auth_token') || null,
  isChecking: true,

  // Login
  login: async (email, password) => {
    try {
      const response = await axios.post('/login', { email, password });
      
      const { user, token } = response.data.data; 
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, token });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login gagal. Periksa email dan password.' 
      };
    }
  },

  // Logout
  logout: async () => {
    try {
      await axios.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      set({ user: null, token: null });
    }
  },

  // Check Session 
  checkSession: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      set({ isChecking: false, user: null });
      return;
    }

    try {
      const response = await axios.get('/user');
      const userData = response.data.data || response.data;
      set({ user: userData, isChecking: false }); 
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      set({ user: null, token: null, isChecking: false });
    }
  }
}));