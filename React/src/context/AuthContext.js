import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import axios from "axios";

const cookieStorage = {
  getItem: (name) => {
    const cookieValue = Cookies.get(name);
    return cookieValue ? JSON.parse(cookieValue) : null;
  },
  setItem: (name, value) => {
    Cookies.set(name, JSON.stringify(value), {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
  },
  removeItem: (name) => {
    Cookies.remove(name);
  },
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      isAuthenticated: () => {
        const user = Cookies.get("user");
        const token = Cookies.get("refreshToken");
        return user && token;
      },

      login: async (email, password) => {
        try {
          const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include", 
          });

          const data = await response.json();
          if (response.ok) {
            set({ user: data.user, accessToken: data.accessToken });
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
            credentials: "include",
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
            credentials: "include",
          });

          const data = await response.json();
          if (response.ok) {
            set({ user: data.user, accessToken: data.accessToken });
            // Cookies will be set automatically by the backend
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
        Cookies.remove("user");
        Cookies.remove("refreshToken");

        const response = axios.post("http://localhost:8000/logout", null, {
          withCredentials: true,
        });

        response.then(() => {
          console.log("Logout successful");
        }).catch((error) => {
          console.error("Logout error:", error);
        })
      },

      refreshAccessToken: async () => {
        try {
          const response = await fetch("http://localhost:8000/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
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
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);

export const useAuth = () => useAuthStore((state) => state);
