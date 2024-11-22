// axiosService.js
import axios from 'axios';

const baseURL = 'http://localhost:8811/api/admin/';

// const baseURL = 'http://192.168.1.42:8811/api/admin/';

const axiosServices = axios.create({
  baseURL,
  timeout: 30000,
});

const getItemLocalStorage = (key) => {
  return localStorage.getItem(key);
};

axiosServices.interceptors.request.use(
  (config) => {
    const token = getItemLocalStorage('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosServices.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error(`Request failed with status ${error.response?.status}: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${error.message}`);
    }

    return Promise.reject(error);
  },
);

export default axiosServices;
