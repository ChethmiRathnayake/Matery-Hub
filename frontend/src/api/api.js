import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:1010",
    withCredentials: true,
});

export default instance;
