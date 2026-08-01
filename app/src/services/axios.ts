import axios from "axios";
import { getToken, clearAuth } from "@/utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://go-server-6ndd.onrender.com/";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to dynamically inject the JWT bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 (unauthorized / expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl: string = error.config?.url ?? "";

    // Only treat 401s from non-auth endpoints as session expiry. A 401 from
    // /auth/* (e.g. wrong password on login) is a normal error the page handles.
    const isAuthEndpoint = requestUrl.includes("/auth/");

    if (status === 401 && !isAuthEndpoint) {
      handleAuthFailure();
    }
    return Promise.reject(error);
  }
);

/**
 * Centralized auth failure handler. On 401, clear stored tokens and redirect
 * to login with the current path as a return URL so the user can resume after
 * re-authenticating.
 *
 * TODO: Add refresh-token flow here once /auth/refresh endpoint exists.
 * On 401, try POST /auth/refresh with { refresh_token: getRefreshToken() }.
 * If successful, save the new access_token and retry the original request.
 * Only call clearAuth + redirect if refresh also fails or returns 401.
 */
function handleAuthFailure() {
  // Avoid a redirect loop if we're already on the login page
  if (window.location.pathname.startsWith("/login")) {
    clearAuth();
    return;
  }

  clearAuth();

  // Redirect to login with return path (full reload is fine for a dead session)
  const currentPath = window.location.pathname + window.location.search;
  const redirectParam = encodeURIComponent(currentPath);
  window.location.href = `/login?redirect=${redirectParam}`;
}

export default api;
