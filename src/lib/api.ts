import { baseUrl } from "@/utils/config";
import axios from "axios";

const api = axios.create({
  baseURL: `/api`,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  if (["post", "put", "delete"].includes(config.method?.toLowerCase() ?? "")) {
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.trim().startsWith("csrfToken="))
      ?.split("=")[1];

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    } else {
      const { data } = await api.get("/auth/csrf");
      config.headers["X-CSRF-Token"] = data.csrfToken;
    }
  }
  return config;
});

export default api;
