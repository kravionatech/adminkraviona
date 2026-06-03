// ─── Central Axios client for the Kraviona admin panel (CRM) ──────────────
// Every page should import { api } from here and use api.get/post/put/delete.
// Base URL is read from VITE_API_URL (see .env) and falls back to the local dev
// server. The auth token (accessToken) is automatically attached from
// localStorage. A 401 response triggers a single refresh-token attempt; if the
// refresh fails, the user is logged out and bounced to /auth.

import axios from "axios";

const BASE_URL = (import.meta?.env?.VITE_API_URL || "http://localhost:3123/api").trim();

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30_000,
});

// ─── Token storage helpers (work even when localStorage is unavailable) ───
const ACCESS_KEY = "kra_access";
const REFRESH_KEY = "kra_refresh";
const USER_KEY = "kra_user";

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY) || "",
  getRefresh: () => localStorage.getItem(REFRESH_KEY) || "",
  getUser: () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "null"); }
    catch { return null; }
  },
  set: ({ accessToken, refreshToken, user }) => {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ─── Request interceptor: attach Bearer token ────────────────────────────
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: unwrap envelope & handle 401 ──────────────────
let refreshing = null; // single in-flight refresh promise

api.interceptors.response.use(
  (res) => {
    // Unwrap { success, data, message, ... } -> data
    if (res.data && typeof res.data === "object" && "success" in res.data) {
      res.data = res.data;
    }
    return res;
  },
  async (error) => {
    const { response, config } = error || {};
    if (!response) return Promise.reject(error);

    // 401: try a single refresh
    if (response.status === 401 && config && !config.__isRetry) {
      const refresh = tokenStore.getRefresh();
      if (refresh && !refreshing) {
        try {
          refreshing = axios.post(`${BASE_URL}/auth/refresh-token`, { token: refresh });
          const r = await refreshing;
          const payload = r.data?.data || {};
          if (payload.accessToken) {
            tokenStore.set({ accessToken: payload.accessToken, refreshToken: payload.refreshToken || refresh });
            config.__isRetry = true;
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${payload.accessToken}`;
            return api.request(config);
          }
        } catch (e) {
          tokenStore.clear();
          if (typeof window !== "undefined" && window.location.pathname !== "/auth") {
            window.location.href = "/auth";
          }
        } finally {
          refreshing = null;
        }
      } else {
        tokenStore.clear();
        if (typeof window !== "undefined" && window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }
      }
    }
    return Promise.reject(error);
  }
);

// ─── Envelope helpers ────────────────────────────────────────────────────
// Standard response shape:
//   { success, data, message, errors? }
// We throw a clean Error when success is false, so callers can use try/catch.
export const ok = (res) => res?.data;
export const data = (res) => res?.data?.data;
export const msg = (res) => res?.data?.message || "";

export async function call(promise) {
  try {
    const res = await promise;
    if (res?.data?.success === false) {
      const err = new Error(res.data.message || "Request failed");
      err.errors = res.data.errors;
      err.status = res.status;
      throw err;
    }
    return res?.data?.data ?? res?.data;
  } catch (err) {
    if (err?.response?.data) {
      const e = new Error(err.response.data.message || `HTTP ${err.response.status}`);
      e.errors = err.response.data.errors;
      e.status = err.response.status;
      throw e;
    }
    throw err;
  }
}

export default api;
