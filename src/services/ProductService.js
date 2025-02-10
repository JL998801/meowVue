import { jsonRequest } from "@/plugins/axios";

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
    return axios.get(`${API_URL}/paged`, {
      params: { page, size, sortBy, order } // ✅ 傳遞 API 參數
    });
  },

  async getAllProducts() {
    return jsonRequest("get", API_URL);
  },

  async getProductById(id) {
    return jsonRequest("get", `${API_URL}/${id}`);
  },

  async searchProducts(searchParams) {
    return jsonRequest("get", `${API_URL}/search`, { params: searchParams });
  },
};
