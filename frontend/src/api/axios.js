import axios from "axios";

const BASE_URL = "http://localhost:1010/api";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClient;
