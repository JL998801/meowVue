import axios from "axios";

const API_BASE_URL = "http://localhost:8080/pages/cart"; // ✅ 確保 API 路徑正確

export const CartService = {
  // ✅ 1. 創建購物車 (會員登入後建立)
  async createCart(memberId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, memberId);
      return response.data;
    } catch (error) {
      console.error("購物車建立失敗:", error);
      throw error;
    }
  },

  // ✅ 2. 查詢購物車內容
  async getCart(memberId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/list/${memberId}`);
      return response.data;
    } catch (error) {
      console.error("查詢購物車失敗:", error);
      throw error;
    }
  },

  // ✅ 3. 新增商品至購物車
  async addToCart(cartItem) {
    try {
      const response = await axios.post(`${API_BASE_URL}/add`, cartItem);
      return response.data;
    } catch (error) {
      console.error("加入購物車失敗:", error);
      throw error;
    }
  },

  // ✅ 4. 刪除購物車內的單筆商品
  async removeFromCart(cartItemId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${cartItemId}`);
      return response.data;
    } catch (error) {
      console.error("刪除購物車商品失敗:", error);
      throw error;
    }
  },

  // ✅ 5. 清空購物車
  async clearCart(memberId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/clear/${memberId}`);
      return response.data;
    } catch (error) {
      console.error("清空購物車失敗:", error);
      throw error;
    }
  },

  // ✅ 6. 更新購物車內商品數量
  async updateCartItem(cartItem) {
    try {
      const response = await axios.put(`${API_BASE_URL}/update`, cartItem);
      return response.data;
    } catch (error) {
      console.error("更新購物車商品數量失敗:", error);
      throw error;
    }
  },

  // ✅ 7. 查詢購物車操作行為紀錄
  async getCartActions(memberId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/actions/${memberId}`);
      return response.data;
    } catch (error) {
      console.error("查詢購物車行為紀錄失敗:", error);
      throw error;
    }
  }
};
