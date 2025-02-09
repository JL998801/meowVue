import { defineStore } from "pinia";
import useUserStore from "@/stores/user";
import { CartService } from "@/services/CartService";
import Swal from "sweetalert2";

const useCartStore = defineStore("cart", {
  state: () => ({
    cartItems: [], // ✅ 存放購物車內容
  }),

  getters: {
    // ✅ 取得購物車商品數量
    cartCount: (state) => state.cartItems.length,

    // ✅ 計算購物車總金額
    cartTotalPrice: (state) =>
      state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
  },

  actions: {
    // ✅ 取得會員購物車內容
    async fetchCart() {
      const userStore = useUserStore();
      if (!userStore.isLogin) return;

      try {
        const cartData = await CartService.getCart(userStore.memberId);
        this.cartItems = cartData || [];
      } catch (error) {
        console.error("購物車加載失敗:", error);
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: errorMessage.value,
        });
      }
    },

    // ✅ 加入購物車
    async addToCart(productId) {
      try {
        await CartService.addItemToCart(productId);
        await this.fetchCart(); // 重新取得購物車內容
      } catch (error) {
        console.error("添加商品到購物車失敗:", error);
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: errorMessage.value,
        });
      }
    },

    // ✅ 移除購物車商品
    async removeItem(cartItemId) {
      try {
        await CartService.removeFromCart(cartItemId);
        this.cartItems = this.cartItems.filter((item) => item.id !== cartItemId);
      } catch (error) {
        console.error("刪除商品失敗:", error);
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: errorMessage.value,
        });
      }
    },

    // ✅ 清空購物車
    async clearCart() {
      const userStore = useUserStore();
      if (!userStore.isLogin) return;

      try {
        await CartService.clearCart(userStore.memberId);
        this.cartItems = [];
      } catch (error) {
        console.error("清空購物車失敗:", error);
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: errorMessage.value,
        });
      }
    },
  },
});

export default useCartStore;
