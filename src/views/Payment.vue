<template>
  <div id="payment">
    <h2>支付頁面</h2>
    <ul>
      <li v-for="item in tempSelectedCart" :key="item.cartItemId">
        {{ item.product.productName }} - 單價: {{ item.product.salePrice }} 元，數量:
        <input
          type="number"
          v-model.number="item.quantity"
          min="1"
          @change="updateTempQuantity(item.cartItemId, item.quantity)"
        />
        <button @click="removeFromTempCart(item.cartItemId)">刪除</button>
      </li>
    </ul>
    <p><strong>總金額:</strong> {{ tempTotalAmount }} 元</p>
    <form @submit.prevent="sendPayment">
      <button type="submit">立即支付</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

// 從環境變數中讀取 API 和 ECPay URL
const apiUrl = import.meta.env.VITE_API_URL;
const ecpayUrl = import.meta.env.VITE_ECPAY_URL;

const store = useStore();
const cart = computed(() => store.state.cart);

// 更新 tempSelectedCart，過濾選中的商品
const tempSelectedCart = ref([]);
watch(
  cart,
  () => {
    // 更新 tempSelectedCart 為 cart 中已選擇的商品
    tempSelectedCart.value = cart.value.filter(item => item.selected);
  },
  { immediate: true } // 首次載入時也要更新
);

// 計算暫存商品的總金額
const tempTotalAmount = computed(() =>
  tempSelectedCart.value.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0)
);

// 修改暫存商品數量
const updateTempQuantity = (id, quantity) => {
  const item = tempSelectedCart.value.find(item => item.cartItemId === id);
  if (item) item.quantity = quantity;
};

// 從暫存列表中刪除商品
const removeFromTempCart = (id) => {
  const index = tempSelectedCart.value.findIndex(item => item.cartItemId === id);
  if (index > -1) tempSelectedCart.value.splice(index, 1);
};

// 將暫存資料轉換為後端所需格式
const convertCartToPaymentData = () => {
  const name = tempSelectedCart.value.map(item => item.product.productName).join(", ");
  const total = tempTotalAmount.value.toString();
  const desc = `包含 ${tempSelectedCart.value.length} 項商品`;
  return { name, total, desc };
};

// 發送支付請求
const sendPayment = () => {
  const body = convertCartToPaymentData();

  axios
    .post(`${apiUrl}/pages/ecpay/send`, body)  // 使用 apiUrl 代替原本的硬編碼 URL
    .then((response) => {
      const container = document.createElement("div");
      container.id = "paymentForm";
      document.body.appendChild(container);
      container.innerHTML = response.data;

      const script = container.querySelector("script");
      if (script) eval(script.textContent);
    })
    .catch((error) => {
      console.error("支付失敗：", error);
    });
};
</script>

<style scoped>
/* 添加樣式（如果有需要） */
</style>
