import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3000",
});

// Adiciona o token JWT do sessionStorage em cada requisição
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Intercepta respostas 401 para tentar refresh automático
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      if (isRefreshing) {
        // Aguarda refresh em andamento
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const res = await fetch("/api/auth/refresh", { method: "POST" });
        const data = await res.json();
        const newToken = data.token || data.accessToken;
        if (newToken) {
          sessionStorage.setItem("token", newToken);
          processQueue(null, newToken);
          if (originalRequest.headers)
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          processQueue("Refresh token inválido", null);
          // Redireciona para login se não conseguir refresh
          window.location.href = "/auth";
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err, null);
        window.location.href = "/auth";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
