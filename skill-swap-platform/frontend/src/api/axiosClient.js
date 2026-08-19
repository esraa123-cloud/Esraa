import axios from 'axios';

// Configure via .env: VITE_API_URL=http://localhost:5000/api
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach the JWT (if present) to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mahara_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors so callers can read err.message directly.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'حدث خطأ غير متوقع، حاول مرة أخرى';
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
