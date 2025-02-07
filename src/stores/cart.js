// store/index.js
import { createStore } from 'vuex';
import axios from 'axios';

export const store = createStore({
  state() {
    const cartData = localStorage.getItem('cart');
    return {
      cart: cartData && cartData !== 'undefined' ? JSON.parse(cartData) : [],
      memberId: 1,
      creditCard: "4311-9511-1111-1111",
      shippingAddress: "123 Main St",
      selectedOrder: null,
    };
  },
  mutations: {
    addToCart(state, product) {
      const found = state.cart.find(item => item.productId === product.productId);
      if (found) {
        found.quantity += product.quantity || 1;
      } else {
        state.cart.push({
          ...product,
          quantity: product.quantity || 1,
          selected: false,
          cartId: Date.now(), // 使用時間戳作為唯一的 cartId
          productName: product.productName
        });
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeFromCart(state, cartId) {
      state.cart = state.cart.filter(item => item.cartId !== cartId);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    updateQuantity(state, { cartId, quantity }) {
      const item = state.cart.find(item => item.cartId === cartId);
      if (item) item.quantity = quantity;
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    clearCart(state) {
      state.cart = [];
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    setCart(state, cartData) {
      state.cart = cartData;
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    setSelected(state, { cartId, selected }) {
      const item = state.cart.find(item => item.cartId === cartId);
      if (item) {
        item.selected = selected;
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    setSelectedOrder(state, order) {
      state.selectedOrder = order;
    },
  },
  actions: {
    async addToCart({ commit, dispatch }, product) {
      commit('addToCart', product);
      await dispatch('syncCartWithServer');
      await dispatch('fetchCartDataFromServer'); // 確保前端更新
    },
    async removeFromCart({ commit, dispatch }, cartId) {
      commit('removeFromCart', cartId);
      await dispatch('syncCartWithServer');
      await dispatch('fetchCartDataFromServer');
    },
    async updateQuantity({ commit, dispatch }, { cartId, quantity }) {
      commit('updateQuantity', { cartId, quantity });
      await dispatch('syncCartWithServer');
      await dispatch('fetchCartDataFromServer');
    },
    async clearCart({ commit, dispatch }) {
      commit('clearCart');
      await dispatch('syncCartWithServer');
      await dispatch('fetchCartDataFromServer');
    },
    async syncCartWithServer({ state }) {
      try {
        if (state.cart.length > 0) {
          const cartData = state.cart.map(item => ({
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
    async fetchCartDataFromServer({ commit, state }) {
      try {
        const memberId = state.memberId;
        const response = await axios.get(`http://localhost:8080/pages/cart/list/${memberId}`);
        if (response.data) {
          const updatedCart = response.data.map(item => ({
            ...item,
            cartId: item.cartId || item.id,
            productName: item.productName || (item.product ? item.product.name : '未知商品')
          }));
          commit('setCart', updatedCart);
        } else {
          commit('clearCart');
        }
      } catch (error) {
        console.error('Failed to fetch cart data from server:', error);
        commit('clearCart');
      }
    },
    // Here we define the updateSelectedOrder action correctly
    updateSelectedOrder({ commit }, order) {
      commit('setSelectedOrder', order);
    },
    async submitOrder({ state, commit }) {
      try {
        const selectedItems = state.cart.filter(item => item.selected).map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          cartId: item.cartId, // 使用購物車中商品的 cartId
        }));
        if (selectedItems.length === 0) {
          alert('請選擇至少一個商品進行結帳');
          return;
        }

        const orderData = {
          member: state.memberId,
          creditCard: state.creditCard,
          shippingAddress: state.shippingAddress,
          selectedItems,
        };

        const response = await axios.post('http://localhost:8080/pages/order/create', orderData);

        if (response.data.success) {
          alert('訂單提交成功！');
          commit('setSelectedOrder', response.data.order);
        } else {
          alert('訂單提交失敗，請稍後再試！');
        }
      } catch (error) {
        console.error('Failed to submit order:', error);
        alert('提交訂單失敗，請稍後再試！');
      }
    },
  },
  getters: {
    selectedCartItems(state) {
      return state.cart.filter(item => item.selected).map(item => ({
        ...item,
        productName: item.productName || '未知商品'
      }));
    },
    totalCartPrice(state) {
      return state.cart.reduce((total, item) => total + (item.product.salePrice * item.quantity), 0);
    },
    selectedOrder(state) {
      return state.selectedOrder;
    },
  },
});

