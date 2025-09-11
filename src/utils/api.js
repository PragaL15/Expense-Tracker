import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-backend-1-70fb.onrender.com/api", // Change to your backend URL
});

// Add Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
