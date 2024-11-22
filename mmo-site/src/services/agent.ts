/* eslint-disable @typescript-eslint/no-explicit-any */
import { clearAllLocalStorage, getItemLocalStorage } from "@/utils/localStorage";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

// Define a base URL for API endpoints
const baseURL = 'http://localhost:8811/api'

// Create a new Axios instance with a custom config
const axiosInstance: AxiosInstance = axios.create({
    baseURL,
    timeout: 30000, // Timeout of 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add a request interceptor to include bearer token with each request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getItemLocalStorage('accessToken'); // Assuming token is stored in localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            // if (error.response?.status === 401) {
            //     clearAllLocalStorage()
            //     window.location.replace('/login')
            // }

            // Handle Axios errors
            console.error(`Request failed with status ${error.response?.status}: ${error.message}`);
        } else {
            // Handle unexpected errors
            console.error(`Unexpected error: ${error.message}`);
        }
        return Promise.reject(error);
    }
);

// Define a generic response type for API responses
interface ApiResponse<T> {
    data: T;
    status: number;
    statusText: string;
}

// Define utility functions for making HTTP requests

// Function to handle GET requests
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axiosInstance.get<T>(url, config);
        return response.data;
    } catch (error) {
        throw new Error(`GET request to ${url} failed: ${error}`)
    }
}

// Function to handle POST requests
export const post = async <T, D = any>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axiosInstance.post<T>(url, data, config);
        return response.data;
    } catch (error) {
        throw new Error(`POST request to ${url} failed: ${error}`);
    }
};

// Function to handle PUT requests
export const put = async <T, D = any>(url: string, data: D, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response: ApiResponse<T> = await axiosInstance.put<T>(url, data, config);
        return response.data;
    } catch (error) {
        throw new Error(`PUT request to ${url} failed: ${error}`);
    }
}

// Function to handle DELETE requests
export const remove = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axiosInstance.delete<T>(url, config);
        return response.data;
    } catch (error) {
        throw new Error(`DELETE request to ${url} failed: ${error}`);
    }
};

export default axiosInstance;