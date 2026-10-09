import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/" : "https://api.vmsystems.cloud",
  timeout: 10000,
  withCredentials: true,
  headers: { "X-Custom-Header": "foobar" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       window.location.href = "/Login";
//     }
//     return Promise.reject(error);
//   },
// );

export default api;
