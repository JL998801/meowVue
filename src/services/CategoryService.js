import axiosapi, { jsonRequest, uploadFile } from "@/plugins/axios";

export const CategoryService = {
    // ✅ 修正：獲取所有類別
    async getAllCategories() {
      try {
        const response = await jsonRequest("get", "/categories");
        console.log("獲取的分類 API 回應:", response.data);  // ✅ 檢查回應內容
        return response.data || [];  // ✅ 確保回傳的是陣列
      } catch (error) {
        console.error("獲取所有類別失敗:", error);
        throw error;
      }
    },
  
    // ✅ 修正：根據分類 ID 獲取商品
    async getProductsByCategory(categoryId) {
      try {
        const response = await jsonRequest("get", `/categories/${categoryId}/products`);
        console.log(`類別 ${categoryId} 的商品 API 回應:`, response.data);
        
        // ✅ 確保正確解析 API 回應，提取 `products`
        return response.data.products || [];  
      } catch (error) {
        console.error(`獲取類別 ${categoryId} 的商品失敗:`, error);
        return [];  // 錯誤時返回空陣列，避免前端報錯
      }
    }
  };
  
