import axios from "axios";
import { BASE_URL } from "./apiHelperUrls";

console.log("ENV:", import.meta.env);
console.log("BASE_URL:", BASE_URL);
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log({ error });
    if (error.response?.status === 401) {
      console.error("Not authenticated");

      // 👉 optional: redirect to login
      // window.location.href = "/login";
    }

    return Promise.reject({
      message: (error.response?.data as any)?.message ?? error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
  },
);
