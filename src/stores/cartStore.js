import { defineStore } from "pinia";
import { axiosapi } from "@/plugins/axios.js"; // 確保 axiosapi 正確導入

export const useCartStore = defineStore("cart", {
  state: () => {
    // 從 localStorage 獲取購物車資料（如果可用）
    const cartData = localStorage.getItem("cart");
    return {
      cart: cartData && cartData !== "undefined" ? JSON.parse(cartData) : [],
      memberId: localStorage.getItem('memberId') || null, // 從 localStorage 獲取會員 ID
      creditCard: "4311-9511-1111-1111", // 測試信用卡（正式環境應移除）
      shippingAddress: "123 Main St", // 測試地址（正式環境應移除）
      selectedOrder: null,
      ecpayUrl: import.meta.env.VITE_ECPAY_URL, // ECPay 付款 URL
      detailUrl: import.meta.env.VITE_DETAIL_URL, // 訂單詳情 URL
    };
  },

  actions: {
    // **登入後自動載入購物車**
    async loginAndFetchCart(memberId) {
      this.memberId = memberId; // 設定會員 ID
      localStorage.setItem("memberId", memberId); // 存入 localStorage
      await this.fetchCartDataFromServer(); // 登入後同步購物車
    },

    // **添加商品至購物車**
    addToCart(product) {
      const found = this.cart.find((item) => item.productId === product.productId);
      if (found) {
        found.quantity += product.quantity || 1;
      } else {
        this.cart.push({
          ...product,
          quantity: product.quantity || 1,
          selected: false,
          cartId: Date.now(),
          productName: product.productName,
        });
      }
      this.setCart(this.cart); // 更新購物車並同步狀態
    },

    // **移除購物車商品**
    removeFromCart(cartId) {
      this.cart = this.cart.filter((item) => item.cartId !== cartId);
      this.setCart(this.cart);
    },

    // **更新數量**
    updateQuantity({ cartId, quantity }) {
      const item = this.cart.find((item) => item.cartId === cartId);
      if (item) {
        item.quantity = quantity;
        this.setCart(this.cart);
      }
    },

    // **清空購物車**
    clearCart() {
      this.cart = [];
      this.setCart(this.cart);
    },

    // **設置購物車數據並同步至 localStorage**
    setCart(cartData) {
      this.cart = cartData;
      localStorage.setItem("cart", JSON.stringify(this.cart));
      this.syncCartWithServer(); // 立即同步至伺服器
    },

    // **選擇商品**
    setSelected({ cartId, selected }) {
      const item = this.cart.find((item) => item.cartId === cartId);
      if (item) {
        item.selected = selected;
        this.setCart(this.cart);
      }
    },

    // **同步購物車到伺服器**
    async syncCartWithServer() {
      try {
        if (this.cart.length > 0 && this.memberId) {
          const cartData = this.cart.map((item) => ({
            cartId: item.cartId,
            quantity: item.quantity,
            selected: item.selected,
            productId: item.productId,
            productName: item.productName,
          }));
          await axiosapi.put(`/pages/cart/update/${this.memberId}`, cartData);
        }
      } catch (error) {
        console.error("購物車同步失敗:", error);
      }
    },

    // **從伺服器獲取購物車數據**
    async fetchCartDataFromServer() {
      try {
        if (!this.memberId) return; // 沒有登入則不請求數據

        const response = await axiosapi.get(`/pages/cart/list/${this.memberId}`);
        if (response.data) {
          const updatedCart = response.data.map((item) => ({
            ...item,
            cartId: item.cartId || item.id,
            productName: item.productName || (item.product ? item.product.name : "未知商品"),
          }));
          this.setCart(updatedCart);
        } else {
          this.clearCart();
        }
      } catch (error) {
        console.error("獲取購物車數據失敗:", error);
        this.clearCart();
      }
    },

    // **提交訂單**
    async submitOrder() {
      try {
        const selectedItems = this.cart
          .filter((item) => item.selected)
          .map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            cartId: item.cartId,
          }));

        if (selectedItems.length === 0) {
          alert("請至少勾選一個商品進行結帳");
          return;
        }

        const orderData = {
          member: this.memberId,
          creditCard: this.creditCard,
          shippingAddress: this.shippingAddress,
          selectedItems,
        };

        const response = await axiosapi.post(`/pages/order/create`, orderData);
        if (response.data.success) {
          alert("訂單提交成功！");
          this.setSelectedOrder(response.data.order);
          this.clearCart(); // 清空購物車
        } else {
          alert("訂單提交失敗，請稍後再試！");
        }
      } catch (error) {
        console.error("訂單提交失敗:", error);
        alert("提交訂單失敗，請稍後再試！");
      }
    },
  },

  getters: {
    selectedCartItems(state) {
      return state.cart.filter((item) => item.selected).map((item) => ({
        ...item,
        productName: item.productName || "未知商品",
      }));
    },

    totalCartPrice(state) {
      return state.cart.reduce(
        (total, item) => total + (item.product.salePrice * item.quantity),
        0
      );
    },

    selectedOrder(state) {
      return state.selectedOrder;
    },
  },
});

export const useOrderStore = defineStore("order", {
  state: () => ({
    selectedOrder: null, // 儲存選中的訂單
  }),
  actions: {
    updateSelectedOrder(order) {
      this.selectedOrder = order; // 更新選中的訂單
    },
  },
  getters: {
    getSelectedOrder(state) {
      return state.selectedOrder; // 取得選中的訂單
    },
  },
});

export default useCartStore;