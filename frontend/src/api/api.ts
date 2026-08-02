import axios from "axios";
import { mutate } from "swr";
import { cache } from "swr/_internal";

const API_BASE_URL ="https://spa-booking.fastapicloud.dev";
// "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
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
      console.log("hererere");
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
