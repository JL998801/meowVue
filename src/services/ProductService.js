import { jsonRequest } from "@/plugins/axios";

const API_URL = "/products";

export const ProductService = {
  async getPagedProducts(page = 0, size = 10, sortBy = "productName", order = "asc") {
    return jsonRequest("get", `${API_URL}/paged`, {
      params: { page, size, sortBy, order },
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
