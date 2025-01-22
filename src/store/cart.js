import { createStore } from 'vuex';
import axios from 'axios';

export const store = createStore({
  state() {
    const cartData = localStorage.getItem('cart');
    return {
      cart: cartData && cartData !== 'undefined' ? JSON.parse(cartData) : [],
      memberId: 1, // 假设您会从用户信息中动态获取会员ID
    };
  },
  mutations: {
    addToCart(state, product) {
      const found = state.cart.find(item => item.productId === product.productId);
      if (found) {
        found.quantity += product.quantity || 1;
      } else {
        state.cart.push({ ...product, quantity: product.quantity || 1, selected: false });
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
        // 更新 localStorage
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    }
  },
  actions: {
    addToCart({ commit }, product) {
      commit('addToCart', product);
      this.dispatch('syncCartWithServer'); // 添加商品后同步购物车数据
    },
    removeFromCart({ commit }, cartId) {
      commit('removeFromCart', cartId);
      this.dispatch('syncCartWithServer'); // 删除商品后同步购物车数据
    },
    updateQuantity({ commit }, { cartId, quantity }) {
      commit('updateQuantity', { cartId, quantity });
      this.dispatch('syncCartWithServer'); // 更新商品数量后同步购物车数据
    },
    clearCart({ commit }) {
      commit('clearCart');
      this.dispatch('syncCartWithServer'); // 清空购物车后同步购物车数据
    },
    async syncCartWithServer({ state }) {
      try {
        if (state.cart.length > 0) {
          const cartData = state.cart.map(item => ({
            cartId: item.cartId,
            quantity: item.quantity,
            selected: item.selected,
            productId: item.productId,
          }));
          await axios.put('http://localhost:8080/pages/cart/update', cartData);
        }
      } catch (error) {
        console.error('Failed to sync cart with server:', error);
      }
    },
    async fetchCartDataFromServer({ commit, state }) {
      try {
        const memberId = state.memberId; // 从 state 获取会员ID
        const response = await axios.get(`http://localhost:8080/pages/cart/list/${memberId}`);
        if (response.data) {
          commit('setCart', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch cart data from server:', error);
      }
    },
  },
  getters: {
    selectedCartItems(state) {
      return state.cart.filter(item => item.selected);
    },
    totalCartPrice(state) {
      return state.cart.reduce((total, item) => total + item.product.salePrice * item.quantity, 0);
    },
  },
});
