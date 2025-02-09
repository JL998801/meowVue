import { jsonRequest } from "@/plugins/axios";

const API_URL = "/tags";

export const ProductTagService = {
  async getAllTags() {
    return jsonRequest("get", API_URL);
  },

  async searchTags(keyword) {
    return jsonRequest("get", `${API_URL}/search`, { params: { keyword } }); 
  },

  async createTag(tag) {
    return jsonRequest("post", API_URL, tag);
  },

  async updateTag(id, tag) {
    return jsonRequest("put", `${API_URL}/${id}`, tag);
  },

  async deleteTag(id) {
    return jsonRequest("delete", `${API_URL}/${id}`);
  },
};
