import axios from "axios";
const BASE_URL='http://localhost:1010/api'

export default axios.create({
    baseURL:BASE_URL,
    withCredentials:true
})

