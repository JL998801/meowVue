import { jsonRequest } from "@/plugins/axios";
import axiosapi from "@/plugins/axios";

const API_URL = "/products";

export const ProductService = {
  /**
   * 取得分頁商品數據
   * @param {number} page 當前頁碼 (預設 0)
   * @param {number} size 每頁商品數量 (預設 10)
   * @param {string} sortBy 排序字段 (預設 "productName")
   * @param {string} order 排序方式 ("asc" 或 "desc")
   */
  async getPagedProducts(page = 0, size = 10, sortBy = "productName", order = "asc") {
    // return axiosapi.get(`${API_URL}/paged`, {
    //   params: { page, size, sortBy, order } // ✅ 傳遞 API 參數
    // });
    return jsonRequest("get", `${API_URL}/paged?page=${page}&size=${size}&sortBy=${sortBy}&order=${order}`);
  },

  async getAllProducts() {
    return jsonRequest("get", API_URL);
  },

  async getProductById(id) {
    return jsonRequest("get", `${API_URL}/${id}`);
  },

  async searchProducts(searchParams) {
    return jsonRequest("post", `${API_URL}/search`, searchParams);
},
};
// import axios,{} from "axios";

// const API_URL = "/products";

// export const ProductService = {
//   /**
//    * ✅ 取得分頁商品數據
//    */
//   async getPagedProducts(page = 0, size = 10, sortBy = "productName", order = "asc") {
//     return axios.get(`${API_URL}/paged`, {
//       params: { page, size, sortBy, order } // ✅ 傳遞 API 參數
//     });
//   },

//   /**
//    * ✅ 取得所有商品
//    */
//   async getAllProducts() {
//     return axios.get(API_URL);
//   },

//   /**
//    * ✅ 透過商品 ID 取得單一商品
//    */
//   async getProductById(id) {
//     return axios.get(`${API_URL}/${id}`);
//   },

//   /**
//    * ✅ 根據條件查詢商品（名稱、類別、價格、標籤）
//    */
//   async searchProducts(filter) {
//     try {
//         // ✅ 確保 `tags` 是 `List<String>`，避免空值影響
//         if (filter.tags && Array.isArray(filter.tags)) {
//             filter.tags = filter.tags.filter(tag => tag.trim() !== "");
//         }

//         const response = await axios.post(`${API_URL}/search`, filter, {
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });

//         return response;
//     } catch (error) {
//         console.error("搜尋 API 錯誤:", error);
//         throw error;
//     }
//   },
  
// };
