import { defineStore } from "pinia";
import { axiosapi } from "@/plugins/axios.js"; // Ensure axiosapi is imported correctly

export const useCartStore = defineStore("cart", {
  state: () => {
    // Retrieve cart data from localStorage (if available)
    const cartData = localStorage.getItem("cart");
    return {
      cart: cartData && cartData !== "undefined" ? JSON.parse(cartData) : [],
      memberId: localStorage.getItem('memberId') || 1, // Retrieve memberId from localStorage, fallback to 1
      creditCard: "4311-9511-1111-1111", // Example credit card (use real data handling in production)
      shippingAddress: "123 Main St", // Example shipping address (use real address handling in production)
      selectedOrder: null,
      ecpayUrl: import.meta.env.VITE_ECPAY_URL, // Use environment variable for ECPay URL
      detailUrl: import.meta.env.VITE_DETAIL_URL, // Use environment variable for detail URL
    };
  },

  actions: {
    // Add a product to the cart
    addToCart(product) {
      const found = this.cart.find((item) => item.productId === product.productId);
      if (found) {
        found.quantity += product.quantity || 1; // Increase quantity if already exists
      } else {
        this.cart.push({
          ...product,
          quantity: product.quantity || 1,
          selected: false,
          cartId: Date.now(), // Unique cart ID based on timestamp
          productName: product.productName, // Store product name
        });
      }
      localStorage.setItem("cart", JSON.stringify(this.cart)); // Save to localStorage
      this.syncCartWithServer(); // Sync with server
    },

    // Remove a product from the cart
    removeFromCart(cartId) {
      this.cart = this.cart.filter((item) => item.cartId !== cartId); // Filter out the item by cartId
      localStorage.setItem("cart", JSON.stringify(this.cart)); // Save to localStorage
      this.syncCartWithServer(); // Sync with server
    },

    // Update the quantity of an item in the cart
    updateQuantity({ cartId, quantity }) {
      const item = this.cart.find((item) => item.cartId === cartId);
      if (item) {
        item.quantity = quantity; // Update the quantity
        localStorage.setItem("cart", JSON.stringify(this.cart)); // Save to localStorage
        this.syncCartWithServer(); // Sync with server
      }
    },

    // Clear all items from the cart
    clearCart() {
      this.cart = [];
      localStorage.setItem("cart", JSON.stringify(this.cart)); // Clear localStorage
      this.syncCartWithServer(); // Sync with server
    },

    // Set cart data from the server (or localStorage)
    setCart(cartData) {
      this.cart = cartData;
      localStorage.setItem("cart", JSON.stringify(this.cart)); // Save cart data to localStorage
    },

    // Set the selection status of a cart item
    setSelected({ cartId, selected }) {
      const item = this.cart.find((item) => item.cartId === cartId);
      if (item) {
        item.selected = selected; // Update selection status
        localStorage.setItem("cart", JSON.stringify(this.cart)); // Save to localStorage
      }
    },

    // Set the selected order details
    setSelectedOrder(order) {
      this.selectedOrder = order; // Set the selected order
    },

    // Sync cart data with the server
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
          await axiosapi.put(`/pages/cart/update/${this.memberId}`, cartData); // Sync with member-specific cart
        }
      } catch (error) {
        console.error("Failed to sync cart with server:", error); // Handle sync error
      }
    },

    // Fetch cart data from the server (use memberId to fetch personalized cart)
    async fetchCartDataFromServer() {
      try {
        const response = await axiosapi.get(`/pages/cart/list/${this.memberId}`);
        if (response.data) {
          const updatedCart = response.data.map((item) => ({
            ...item,
            cartId: item.cartId || item.id, // 確保 cartId 來自伺服器
            productName: item.productName || (item.product ? item.product.name : "未知商品"),
          }));
          this.setCart(updatedCart);
        } else {
          this.clearCart();
        }
      } catch (error) {
        console.error("Failed to fetch cart data from server:", error);
        this.clearCart();
      }
    
    },

    // Submit the order to the server (checkout process)
    async submitOrder() {
      try {
        const selectedItems = this.cart
          .filter((item) => item.selected) // Filter selected items for checkout
          .map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            cartId: item.cartId,
          }));

        if (selectedItems.length === 0) {
          alert("請至少勾選一個商品進行結帳"); // Prompt if no items selected
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
          alert("訂單提交成功！"); // Success alert
          this.setSelectedOrder(response.data.order); // Set selected order details
        } else {
          alert("訂單提交失敗，請稍後再試！"); // Failure alert
        }
      } catch (error) {
        console.error("Failed to submit order:", error); // Log error
        alert("提交訂單失敗，請稍後再試！"); // Alert if error occurs
      }
    },
  },

  getters: {
    // Get selected cart items (those marked for checkout)
    selectedCartItems(state) {
      return state.cart.filter((item) => item.selected).map((item) => ({
        ...item,
        productName: item.productName || "未知商品", // Default product name if not available
      }));
    },

    // Calculate the total price of selected items in the cart
    totalCartPrice(state) {
      return state.cart.reduce(
        (total, item) => total + (item.product.salePrice * item.quantity),
        0
      );
    },

    // Get selected order details
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