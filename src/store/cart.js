import { createStore } from 'vuex';
import axios from 'axios';

export const store = createStore({
  state() {
    const cartData = localStorage.getItem('cart');
    return {
      cart: cartData && cartData !== 'undefined' ? JSON.parse(cartData) : [],
      memberId: 1, // 假设从用户信息中动态获取会员ID
      selectedOrder: null, // 新增: 存储交易明细
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
          cartId: product.cartId, 
          productName: product.productName // 确保商品名稱被存储
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
      state.selectedOrder = order; // 設定交易明細
    },
  },
  actions: {
    addToCart({ commit }, product) {
      commit('addToCart', product);
      this.dispatch('syncCartWithServer');
    },
    removeFromCart({ commit }, cartId) {
      commit('removeFromCart', cartId);
      this.dispatch('syncCartWithServer');
    },
    updateQuantity({ commit }, { cartId, quantity }) {
      commit('updateQuantity', { cartId, quantity });
      this.dispatch('syncCartWithServer');
    },
    clearCart({ commit }) {
      commit('clearCart');
      this.dispatch('syncCartWithServer');
    },
    updateSelectedOrder({ commit }, order) {
      commit('setSelectedOrder', order);
    },
    async syncCartWithServer({ state }) {
      try {
        if (state.cart.length > 0) {
          const cartData = state.cart.map(item => ({
            cartId: item.cartId,
            quantity: item.quantity,
            selected: item.selected,
            productId: item.productId,
            productName: item.productName // 确保商品名稱同步到後端
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
            productName: item.productName || (item.product ? item.product.name : '未知商品') // 确保商品名稱存在
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
  },
  getters: {
    selectedCartItems(state) {
      return state.cart.filter(item => item.selected).map(item => ({
        ...item,
        productName: item.productName || '未知商品' // 確保前端獲取商品名稱
      }));
    },
    totalCartPrice(state) {
      return state.cart.reduce((total, item) => total + (item.product.salePrice * item.quantity), 0);
    },
    selectedOrder(state) {
      return state.selectedOrder; // 新增: 取得交易明細
    },
  },
});
