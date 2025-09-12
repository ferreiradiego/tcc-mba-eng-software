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


// Intercepta respostas normalmente, sem refresh automático
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
