


import {create} from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      isAuthenticated: () => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("refreshToken");
        return user && token;
      },

      login: async (email, password) => {
        try {
          const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          if (response.ok) {
            set({ user: data.user, accessToken: data.accessToken });
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("refreshToken", data.refreshToken); 
            return { ok: true };
          } else {
            console.error(data.error);
            return { ok: false, error: data.error };
          }
        } catch (error) {
          console.error("Login error:", error);
          return { ok: false, error: "An unexpected error occurred" };
        }
      },

      signup: async (name, email, password) => {
        try {
          const response = await fetch("http://localhost:8000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          });

          const data = await response.json();
          if (response.ok) {
            return { ok: true };
          } else {
            console.error(data.error);
            return { ok: false, error: data.error };
          }
        } catch (error) {
          console.error("Register error:", error);
          return { ok: false, error: "An unexpected error occurred" };
        }
      },

      verifyToken: async (email, code) => {
        try {
          const response = await fetch("http://localhost:8000/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
          });

          const data = await response.json();
          if (response.ok) {
            set({ user: data.user, accessToken: data.accessToken });
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("refreshToken", data.refreshToken); 
            return { ok: true };
          } else {
            console.error(data.error);
            return { ok: false, error: data.error };
          }
        } catch (error) {
          console.error("Verification error:", error);
          return { ok: false, error: "An unexpected error occurred" };
        }
      },

 
      logout: () => {
        set({ user: null, accessToken: null });
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
      },


      refreshAccessToken: async () => {
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            console.log("No refresh token found. Logging out...");
            set({ user: null, accessToken: null });
            return;
          }

          const response = await fetch("http://localhost:8000/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          const data = await response.json();
          if (response.ok) {
            set({ accessToken: data.accessToken });
            console.log("Access token refreshed");
          } else {
            console.log("Failed to refresh access token. Logging out...");
            set({ user: null, accessToken: null });
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          set({ user: null, accessToken: null });
        }
      },
    }),
    {
      name: "auth", 
    }
  )
);

export const useAuth = () => useAuthStore((state) => state);

