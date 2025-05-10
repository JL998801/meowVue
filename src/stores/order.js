// src/stores/order.js
import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({
    selectedOrder: null, // 用來存儲選中的訂單
  }),

  actions: {
    updateSelectedOrder(order) {
      this.selectedOrder = order; // 更新選中的訂單
    },

    clearSelectedOrder() {
      this.selectedOrder = null; // 清空選中的訂單
    }
  },

  getters: {
    getSelectedOrder(state) {
      return state.selectedOrder; // 獲取選中的訂單
    },
  },
});
