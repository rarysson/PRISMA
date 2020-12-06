import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/user"
});

export default API;
