import axios from "axios";

// Create an axios instance
const BASE_URL = 'http://100.120.106.127:1010/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInstance;