import { createStore } from 'vuex';
import axios from 'axios';

export const store = createStore({
  state() {
    const cartData = localStorage.getItem('cart');
    return {
      cart: cartData && cartData !== 'undefined' ? JSON.parse(cartData) : [],
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
    removeFromCart(state, id) {
      state.cart = state.cart.filter(item => item.cartId !== id);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    updateQuantity(state, { id, quantity }) {
      const item = state.cart.find(item => item.cartId === id);
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
  },
  actions: {
    addToCart({ commit }, product) {
      commit('addToCart', product);
    },
    removeFromCart({ commit }, id) {
      commit('removeFromCart', id);
    },
    updateQuantity({ commit }, payload) {
      commit('updateQuantity', payload);
    },
    clearCart({ commit }) {
      commit('clearCart');
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
    async fetchCartDataFromServer({ commit }) {
      try {
        const memberId = 1;
        const response = await axios.get(`http://localhost:8080/pages/cart/list/${memberId}`);
        commit('setCart', response.data); // 使用 commit 而不是 dispatch
      } catch (error) {
        console.error('Failed to fetch cart data from server:', error);
      }
    },
  },
});
