import { defineStore } from "pinia";
import useUserStore from "@/stores/user";
import { CartService } from "@/services/CartService";
import Swal from "sweetalert2";
import axios from 'axios';

const useCartStore = defineStore("cart", {
  state: () => ({
    cartItems: [], // 存放購物車內容
    memberId: 1, // 假設這是會員ID
    creditCard: "4311-9511-1111-1111", // 測試用信用卡
    shippingAddress: "123 Main St", // 測試用地址
    selectedOrder: null, // 訂單資訊
  }),

  getters: {
    cartCount: (state) => state.cartItems.length, // 取得購物車商品數量
    cartTotalPrice: (state) =>
      state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0), // 計算購物車總金額
    selectedCartItems(state) {
      return state.cartItems.filter(item => item.selected).map(item => ({
        ...item,
        productName: item.productName || '未知商品'
      }));
    },
    totalCartPrice(state) {
      return state.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    selectedOrder(state) {
      return state.selectedOrder;
    },
  },

  actions: {
    // 取得會員購物車內容
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
          text: error.message,
        });
      }
    },

    // 加入購物車
    async addToCart(cartItem) {
      const requestData = {
        items: [cartItem],
        memberId: localStorage.getItem("memberId"),
      };

      try {
        const response = await CartService.addToCart(requestData);
        if (response.success) {
          await this.fetchCart(); // Re-fetch the cart to ensure synchronization
          Swal.fire({
            icon: "success",
            title: "成功加入購物車",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "添加失敗",
            text: response.message, // Provide server response message
          });
        }
      } catch (error) {
        console.error("添加商品到購物車失敗:", error);
        Swal.fire({
          icon: "error",
          title: "添加失敗",
          text: error.message, // Display error message
        });
      }
    },

    // 移除購物車商品
    async removeItem(cartItemId) {
      try {
        await CartService.removeFromCart(cartItemId);
        this.cartItems = this.cartItems.filter((item) => item.id !== cartItemId);
      } catch (error) {
        console.error("刪除商品失敗:", error);
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: error.message,
        });
      }
    },

    // 清空購物車
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
          text: error.message,
        });
      }
    },

    // 同步購物車到伺服器
    async syncCartWithServer() {
      try {
        if (this.cartItems.length > 0) {
          const cartData = this.cartItems.map(item => ({
            cartId: item.cartId,
            quantity: item.quantity,
            selected: item.selected,
            productId: item.productId,
            productName: item.productName
          }));
          await axios.put('http://localhost:8080/pages/cart/update', cartData);
        }
      } catch (error) {
        console.error('Failed to sync cart with server:', error);
      }
    },

    // 從伺服器獲取購物車資料
    async fetchCartDataFromServer() {
      try {
        const memberId = this.memberId;
        const response = await axios.get(`http://localhost:8080/pages/cart/list/${memberId}`);
        if (response.data) {
          const updatedCart = response.data.map(item => ({
            ...item,
            cartId: item.cartId || item.id,
            productName: item.productName || (item.product ? item.product.name : '未知商品')
          }));
          this.cartItems = updatedCart;
        } else {
          this.cartItems = [];
        }
      } catch (error) {
        console.error('Failed to fetch cart data from server:', error);
        this.cartItems = [];
      }
    },

    // 提交訂單
    async submitOrder() {
      try {
        const selectedItems = this.cartItems.filter(item => item.selected).map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          cartId: item.cartId, // 使用購物車中商品的 cartId
        }));
        if (selectedItems.length === 0) {
          Swal.fire({
            icon: "warning",
            title: "請選擇至少一個商品進行結帳",
          });
          return;
        }

        const orderData = {
          member: this.memberId,
          creditCard: this.creditCard,
          shippingAddress: this.shippingAddress,
          selectedItems,
        };

        const response = await axios.post('http://localhost:8080/pages/order/create', orderData);

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "訂單提交成功！",
          });
          this.selectedOrder = response.data.order;
        } else {
          Swal.fire({
            icon: "error",
            title: "訂單提交失敗，請稍後再試！",
          });
        }
      } catch (error) {
        console.error('Failed to submit order:', error);
        Swal.fire({
          icon: "error",
          title: "提交訂單失敗，請稍後再試！",
        });
      }
    },
  },
});

export default useCartStore;
