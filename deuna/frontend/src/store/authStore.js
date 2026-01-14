import { create } from 'zustand';
import { authAPI, usuarioAPI } from '../services/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (correo, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login(correo, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      set({ 
        user: data.usuario, 
        token: data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.mensaje || 'Error al iniciar sesión';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      set({ 
        user: data.usuario, 
        token: data.token, 
        isAuthenticated: true, 
        loading: false 
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.mensaje || 'Error al registrarse';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  refreshUser: async () => {
    try {
      const { data } = await usuarioAPI.getMe();
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data });
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
