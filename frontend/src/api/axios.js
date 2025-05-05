import axios from "axios";
const BASE_URL='http://100.120.106.127:1010/api'

export default axios.create({
    baseURL: "http://100.120.106.127:1010/api",
    headers: {
        "Content-Type": "application/json"
    }
});

