import axios from "axios";

const axiosapi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

axiosapi.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response && error.response.status && error.response.status === 403) {
        window.location.href = "/403";
    }
    return Promise.reject(error);
}
);

// **普通 JSON API 請求**
export const jsonRequest = (method, url, data = {}) => {
    return api({
      method,
      url,
      data,
      headers: { "Content-Type": "application/json" },
    });
  };
  
  // **Form-Data 上傳圖片**
  export const uploadFile = (url, formData) => {
    return api.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

export default axiosapi;
