import { jsonRequest } from "@/plugins/axios";

const API_URL = "/api/wishlists";

export const WishListService = {
  async addToWishList(productId, memberId) {
    return jsonRequest("post", API_URL, { memberId, productId });
  },

  async removeFromWishList(productId, memberId) {
    return jsonRequest("delete", API_URL, { memberId, productId });
  },

  async getWishList(memberId) {
    if (!memberId) {
      console.error("❌ 未提供 `memberId`，無法獲取願望清單");
      return [];
    }
    return jsonRequest("get", `${API_URL}?memberId=${memberId}`);
  },
};
