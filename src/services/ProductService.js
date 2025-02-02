import axiosapi, { jsonRequest, uploadFile } from "@/plugins/axios";

// 商品服務 API
export const ProductService = {
  // ✅ 1. 獲取所有商品
  async getAllProducts() {
    try {
      const response = await jsonRequest("get", "/products");
      return response.data;
    } catch (error) {
      console.error("獲取所有商品失敗:", error);
      throw error;
    }
  },

  // ✅ 2. 根據商品 ID 查詢商品
  async getProductById(id) {
    try {
      const response = await jsonRequest("get", `/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`獲取商品 ID ${id} 失敗:`, error);
      throw error;
    }
  },

  // ✅ 3. 搜尋商品（根據名稱、價格區間、庫存）
  async searchProducts(searchParams) {
    try {
      const response = await jsonRequest("post", "/products/search", searchParams);
      return response.data;
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
      return response.data;
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
      return response.data;
    } catch (error) {
      console.error(`更新商品 ID ${id} 失敗:`, error);
      throw error;
    }
  },

  // ✅ 6. 刪除商品
  async deleteProduct(id) {
    try {
      const response = await jsonRequest("delete", `/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`刪除商品 ID ${id} 失敗:`, error);
      throw error;
    }
  },
};
