import { jsonRequest } from "@/plugins/axios";

const API_URL = "/pages/cart";

export const CartService = {
  async createCart(memberId) {
    return jsonRequest("post", `${API_URL}/create`, { memberId });
  },

  async getCart(memberId) {
    return jsonRequest("get", `${API_URL}/list/${memberId}`);
  },

  async addToCart(cartItem) {
    return jsonRequest("post", `${API_URL}/add`, cartItem);
  },

  async removeFromCart(cartItemId) {
    return jsonRequest("delete", `${API_URL}/delete/${cartItemId}`);
  },

  async clearCart(memberId) {
    return jsonRequest("delete", `${API_URL}/clear/${memberId}`);
  },

  async updateCartItem(cartItem) {
    return jsonRequest("put", `${API_URL}/update`, cartItem);
  },

  async getCartActions(memberId) {
    return jsonRequest("get", `${API_URL}/actions/${memberId}`);
  },
};
