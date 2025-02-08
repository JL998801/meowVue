import axios from "axios";

const API_URL = "/tags"; // 依據後端設計，這裡使用 `/tags`

export const ProductTagService = {
  // 🔹 取得所有標籤
async getAllTags() {
try {
    const response = await axios.get(`${API_URL}/search?keyword=`);
    return response.data;
} catch (error) {
    console.error("取得標籤失敗:", error);
    throw error;
}
},

// 🔹 模糊搜尋標籤
async searchTags(keyword) {
try {
    const response = await axios.get(`${API_URL}/search`, { params: { keyword } });
    return response.data;
} catch (error) {
    console.error("搜尋標籤失敗:", error);
    throw error;
}
},

// 🔹 新增標籤
async createTag(tag) {
try {
    const response = await axios.post(API_URL, tag);
    return response.data;
} catch (error) {
    console.error("新增標籤失敗:", error);
    throw error;
}
},

// 🔹 更新標籤
async updateTag(id, tag) {
try {
    const response = await axios.put(`${API_URL}/${id}`, tag);
    return response.data;
} catch (error) {
    console.error("更新標籤失敗:", error);
    throw error;
}
},

// 🔹 刪除標籤
async deleteTag(id) {
try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
} catch (error) {
    console.error("刪除標籤失敗:", error);
    throw error;
}
}
};
