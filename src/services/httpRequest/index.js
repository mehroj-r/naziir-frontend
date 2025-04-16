import { customToast } from "@/utils/toastify";
import axios from "axios";

const httpRequest = axios.create({
  baseURL: "https://project2.newuu.uz/api",
  timeout: 100000,
});

httpRequest.interceptors.request.use((config) => {
  const token = JSON.parse(window.localStorage.getItem("persist:user"))?.token?.replace(/"/g, "");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// httpRequest.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 403) {
//       localStorage.clear(); // Clear user data
//       customToast.error("Session expired. Please log in again.");
//     }
//     return Promise.reject(error);
//   }
// );


export default httpRequest;
