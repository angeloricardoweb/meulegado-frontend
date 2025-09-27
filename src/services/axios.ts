import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const apiContract = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token") || "-------------no-token-------------";

    if (token && token !== "-------------no-token-------------") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('Request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// // intercepa 401 e manda para o login
// api.interceptors.response.use(
//   (response) => {
//     return response
//   },

//   (error) => {
//     if (error.response.status === 401) {
//       // Only redirect on client side
//       if (typeof window !== 'undefined') {
//         window.location.href = '/login'
//       }
//     }

//     return Promise.reject(error)
//   },
// )
