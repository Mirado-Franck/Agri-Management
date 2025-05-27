// src/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajouter automatiquement le token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Rafraîchit automatiquement le token si 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh_token = localStorage.getItem("refresh_token");

      try {
        const res = await axios.post("http://127.0.0.1:8000/api/auth/token/refresh/", {
          refresh: refresh_token,
        });

        const new_access = res.data.access;
        localStorage.setItem("access_token", new_access);

        axiosInstance.defaults.headers.Authorization = `Bearer ${new_access}`;
        originalRequest.headers.Authorization = `Bearer ${new_access}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
