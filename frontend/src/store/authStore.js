import { create } from "zustand";
import { authClient } from "../lib/auth-client.js";

export const API_URL = 
  import.meta.env.VITE_NODE_ENV === "production" 
    ? (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + "/api" : "https://shadow-tracker.vercel.app/api")
    : "http://localhost:3000/api";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  id: null,

  login: async ({ username, password }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authClient.signIn.username({
        username,
        password,
      });
      if (response.error) {
        throw new Error(response.error.message || "Failed to login");
      }
      set({
        isAuthenticated: true,
        user: response.data.user.username || response.data.user.name,
        id: response.data.user.id,
        isLoading: false,
      });
      return response;
    } catch (error) {
      console.log("Login error:", error);
      set({ error: error.message || "Login failed", isLoading: false });
      throw error;
    }
  },

  signup: async ({ username, password }) => {
    set({ isLoading: true, error: null });
    try {
      const placeholderEmail = `${username.toLowerCase()}@local.com`;
      const response = await authClient.signUp.email({
        email: placeholderEmail,
        password: password,
        name: username,
        username: username,
      });
      if (response.error) {
        throw new Error(response.error.message || "Failed to sign up");
      }
      set({
        isAuthenticated: true,
        user: response.data.user.username || response.data.user.name,
        id: response.data.user.id,
        isLoading: false,
      });
      return response;
    } catch (error) {
      console.log("Signup error:", error);
      set({ error: error.message || "Signup failed", isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authClient.signOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.log("Logout error:", error);
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const session = await authClient.getSession();
      if (session && session.data && session.data.user) {
        set({
          user: session.data.user.username || session.data.user.name,
          id: session.data.user.id,
          isAuthenticated: true,
          isCheckingAuth: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });
      }
    } catch (error) {
      console.log("Check auth error:", error);
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  },
}));
