import axiosapi, { jsonRequest, uploadFile } from "@/plugins/axios";

// 負責 API 請求

export const CategoryService = {
    // ✅ 獲取所有類別
    async getAllCategories() {
      try {
        const response = await jsonRequest("get", "/categories");
        console.log("獲取的分類 API 回應:", response.data);
        
        // ✅ 確保 categories 不為 null
        return response.data||[];
      } catch (error) {
        console.error("獲取所有類別失敗:", error);
        throw error;
      }
    },

    // ✅ 根據分類 ID 獲取商品
    async getProductsByCategory(categoryId) {
      try {
        const response = await jsonRequest("get", `/categories/${categoryId}`);
        console.log(`類別 ${categoryId} 的商品 API 回應:`, response.data);

        // ✅ 確保正確解析 API 回應，提取 `products`
        return response.data?.products?.map(product => ({
          productId: product.productId,
          productName: product.productName,
          description: product.description,
          salePrice: product.salePrice,
          images: product.imageUrls || []  // ✅ 確保 imageUrls 存在
        })) || [];
      } catch (error) {
        console.error(`獲取類別 ${categoryId} 的商品失敗:`, error);
        return [];  // 錯誤時返回空陣列，避免前端報錯
      }
    }
};
