import axios from "axios";
import { baseURL } from "../common/SummerAPI";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true 
});

// --- Request Interceptor ---
Axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

Axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const unauthorizedEvent = new CustomEvent("on-unauthorized");
            window.dispatchEvent(unauthorizedEvent);
        }
        return Promise.reject(error);
    }
);

export default Axios;