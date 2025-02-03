import axiosapi, { jsonRequest, uploadFile } from "@/plugins/axios";

// 商品服務 API
export const ProductService = {
  // ✅ 1. 獲取所有商品
  async getAllProducts() {
    try {
      const response = await jsonRequest("get", "/products");
      console.log("API 回應:", response.data); // ✅ 確保 response.data 是陣列
      return response.data?.products || response.data;  // 確保回傳的是陣列
    } catch (error) {
      console.error("獲取所有商品失敗:", error);
      throw error;
    }
  },

  // ✅ 2. 根據商品 ID 查詢商品
  async getProductById(id) {
    try {
      const response = await jsonRequest("get", `/products/${id}`);
      console.log("API 回應:", response.data);
      return response.data?.products || response.data;
    } catch (error) {
      console.error(`獲取商品 ID ${id} 失敗:`, error);
      throw error;
    }
  },

  // ✅ 3. 搜尋商品（根據名稱、價格區間、庫存）
  async searchProducts(searchParams) {
    try {
      const response = await jsonRequest("post", "/products/search", searchParams);
      console.log("API 回應:", response.data);
      return response.data?.products || response.data;
    } catch (error) {
      console.error("搜尋商品失敗:", error);
      throw error;
    }
  },

  // ✅ 4. 上傳新商品（JSON + FormData）
  async createProduct(productRequest, productImages = []) {
    try {
      let formData = new FormData();
      formData.append("productRequest", JSON.stringify(productRequest));

      if (productImages.length > 0) {
        productImages.forEach((file) => {
          formData.append("productImages", file);
        });
      }

      const response = await uploadFile("/products", formData);
      console.log("API 回應:", response.data);
      return response.data?.products || response.data;
    } catch (error) {
      console.error("新增商品失敗:", error);
      throw error;
    }
  },

  // ✅ 5. 更新商品（JSON + FormData）
  async updateProduct(id, productRequest, productImages = []) {
    try {
      let formData = new FormData();
      formData.append("productRequest", JSON.stringify(productRequest));

      if (productImages.length > 0) {
        productImages.forEach((file) => {
          formData.append("productImages", file);
        });
      }

      const response = await uploadFile(`/products/${id}`, formData);
      console.log("API 回應:", response.data);
      return response.data?.products || response.data;
    } catch (error) {
      console.error(`更新商品 ID ${id} 失敗:`, error);
      throw error;
    }
  },

  // ✅ 6. 刪除商品
  async deleteProduct(id) {
    try {
      const response = await jsonRequest("delete", `/products/${id}`);
      console.log("API 回應:", response.data);
      return response.data?.products || response.data;
    } catch (error) {
      console.error(`刪除商品 ID ${id} 失敗:`, error);
      throw error;
    }
  },
};
