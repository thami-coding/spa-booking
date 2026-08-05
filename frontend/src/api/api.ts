import axios from "axios";
import { mutate } from "swr";
import { cache } from "swr/_internal";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const isDev = import.meta.env.DEV;
const API_BASE_URL = isDev ? "http://localhost:8000" : BACKEND_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
   timeout: 10000,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response, config } = error;

    if (response && response.status === 401) {
      const publicAuthRoutes = ["/login", "/register", "/"];
      const isPublicRoute = publicAuthRoutes.some((route) =>
        config.url.includes(route),
      );
      
      if (cache instanceof Map) {
        cache.clear();
      }
      mutate(() => true, undefined, { revalidate: false });
      if (!isPublicRoute) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);
