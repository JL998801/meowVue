import { jsonRequest } from "@/plugins/axios";

const API_URL = "/api/categories";

export const CategoryService = {
  async getAllCategories() {
    return jsonRequest("get", API_URL);
  },

  async getProductsByCategory(id) {
    return jsonRequest("get", `${API_URL}/${id}`);
  },
};
