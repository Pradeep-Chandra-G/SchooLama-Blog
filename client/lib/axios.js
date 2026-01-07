import axios from "axios";

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000, // 30 second timeout for cold starts
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.log("Request timeout - backend may be waking up");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
