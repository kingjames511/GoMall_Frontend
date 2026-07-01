import axios from "axios";
import { getToken } from "@/utils/storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://goserver-production-bacf.up.railway.app/";

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

export default api;
