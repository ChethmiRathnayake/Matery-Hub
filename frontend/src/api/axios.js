import axios from "axios";
const BASE_URL='http://localhost:1010/api'

export default axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

