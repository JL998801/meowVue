import { defineStore } from "pinia";
import { WishListService } from "@/services/WishListService";
import Swal from "sweetalert2";

const useWishListStore = defineStore("wishlist", {
  state: () => ({
    wishListItems: [],
  }),

  actions: {
    // ✅ 取得願望清單
    async fetchWishList() {
      try {
        this.wishListItems = await WishListService.getWishList();
      } catch (error) {
        console.error("無法獲取願望清單:", error);
        this.wishListItems = [];
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: errorMessage.value,
        });
      }
    },

    // ✅ 新增至願望清單
    async addToWishList(productId) {
      try {
        await WishListService.addToWishList(productId);
        await this.fetchWishList();
      } catch (error) {
        console.error("加入願望清單失敗:", error);
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: errorMessage.value,
        });
      }
    },

    // ✅ 移除願望清單
    async removeFromWishList(productId) {
      try {
        await WishListService.removeFromWishList(productId);
        await this.fetchWishList();
      } catch (error) {
        console.error("移除願望清單失敗:", error);
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: errorMessage.value,
        });
      }
    },
  },
});
export default useWishListStore;
