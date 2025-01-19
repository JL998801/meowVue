import { createStore } from 'vuex';
import axios from 'axios';

export const store = createStore({
  state() {
    return {
      cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
    };
  },
  mutations: {
    addToCart(state, product) {
      const found = state.cart.find(item => item.productId === product.productId); // Change from id to productId
      if (found) {
        found.quantity += product.quantity || 1; // Update quantity if product exists
      } else {
        state.cart.push({ ...product, quantity: product.quantity || 1, selected: false });
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeFromCart(state, id) {
      state.cart = state.cart.filter(item => item.cartId !== id); // Fixed cartId reference
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
        for (const item of state.cart) {
          await axios.put(`/pages/cart/update`, {  // 修正為與後端路徑一致
            cartId: item.cartId,
            quantity: item.quantity,
          });
        }
      } catch (error) {
        console.error('Failed to sync cart with server:', error);
      }
    },
  },
});
