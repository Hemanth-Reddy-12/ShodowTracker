import axios from "axios";
import { create } from "zustand";

export const API_URL = 
  import.meta.env.VITE_NODE_ENV === "production" 
    ? import.meta.env.VITE_API_URL || "https://shadow-tracker.vercel.app/api"
    : "http://localhost:3000/api";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  id: null,

  verify2FA: async (token) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(
        API_URL + `/auth/verify-2fa`,
        { token },
        { withCredentials: true }
      );
      set({
        isAuthenticated: true,
        user: response.data.user,
        id: response.data.id,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      set({ error: error.response.data.msg, isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/auth/check-auth`, {
        withCredentials: true,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: error.response.data.msg, isCheckingAuth: false });
    }
  },
}));
