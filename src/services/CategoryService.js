import { jsonRequest } from "@/plugins/axios";

const API_URL = "/categories";

export const CategoryService = {
  async getAllCategories() {
    return jsonRequest("get", API_URL);
  },

  async getProductsByCategory(id) {
    return jsonRequest("get", `${API_URL}/${id}`);
  },
};
