import axios from 'axios';

const axiosapi = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // 後端 API URL
    withCredentials: true, // 允許攜帶 cookies 或 Authorization header
    headers: {
        'Content-Type': 'application/json', // 預設為 JSON 格式的請求
    },
});

console.log('Base URL:', import.meta.env.VITE_API_URL);

export default axiosapi;
