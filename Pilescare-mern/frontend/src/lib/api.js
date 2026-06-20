import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token automatically
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("proctocare_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      window.location.pathname.startsWith("/admin") &&
      window.location.pathname !== "/admin/login"
    ) {
      localStorage.removeItem("proctocare_token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(err);
  },
);

export const formatApiError = (detail) => {
  if (!detail) return null;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((d) => d.msg || JSON.stringify(d)).join(", ");
  return JSON.stringify(detail);
};

export default api;
