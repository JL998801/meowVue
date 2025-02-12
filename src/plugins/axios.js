import axios from "axios";

// 創建 Axios 實例
const axiosapi = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // 確保 API Base URL 來自環境變數
});

// 請求攔截器 (Request Interceptor)
axiosapi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken"); // 從 localStorage 取得 Token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // 自動附加 `Authorization` Header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 回應攔截器 (Response Interceptor)
axiosapi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            window.location.href = "/403"; // 自動導向 403 頁面
        }
        console.error("🔴 API 錯誤:", error.response?.data || error.message);
        return Promise.reject(error.response?.data || error.message);
    }
);

// JSON API 請求
export const jsonRequest = async (method, url, data = {}) => {
    try {
        const response = await axiosapi({
            method,
            url,
            data,
            params: method === "get" ? data : undefined,
            headers: { "Content-Type": "application/json" }
        });
        console.log("✅ API 回應:", response.data);
        return response.data;
    } catch (error) {
        console.error(`🔴 API 調用失敗 [${method.toUpperCase()} ${url}]`, error);
        throw error;
    }
};

// 上傳圖片 (Form-Data)
export const uploadFile = (url, formData) => {
    return axiosapi.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" }, // 確保 Form-Data 格式
    });
};

export default axiosapi;