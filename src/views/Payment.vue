<template>
  <div id="payment">
    <h2>支付頁面</h2>
    <ul>
      <li v-for="item in tempSelectedCart" :key="item.id">
        {{ item.productName }} - 單價: {{ item.salePrice }} 元，數量:
        <input
          type="number"
          v-model.number="item.quantity"
          min="1"
          @change="updateTempQuantity(item.id, item.quantity)"
        />
        <button @click="removeFromTempCart(item.id)">刪除</button>
      </li>
    </ul>
    <p><strong>總金額:</strong> {{ tempTotalAmount }} 元</p>
    <form @submit.prevent="sendPayment">
      <button type="submit">立即支付</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();
const cart = computed(() => store.state.cart);

// 複製選擇的購物車商品作為支付頁面暫存資料
const tempSelectedCart = ref(cart.value.filter((item) => item.selected));

// 計算暫存商品的總金額
const tempTotalAmount = computed(() =>
  tempSelectedCart.value.reduce((sum, item) => sum + item.salePrice * item.quantity, 0)
);

// 修改暫存商品數量
const updateTempQuantity = (id, quantity) => {
  const item = tempSelectedCart.value.find((item) => item.id === id);
  if (item) item.quantity = quantity;
};

// 從暫存列表中刪除商品
const removeFromTempCart = (id) => {
  const index = tempSelectedCart.value.findIndex((item) => item.id === id);
  if (index > -1) tempSelectedCart.value.splice(index, 1);
};

// 將暫存資料轉換為後端所需格式
const convertCartToPaymentData = () => {
  const name = tempSelectedCart.value.map((item) => item.productName).join(", ");
  const total = tempTotalAmount.value.toString();
  const desc = `包含 ${tempSelectedCart.value.length} 項商品`;
  return { name, total, desc };
};

// 發送支付請求
const sendPayment = () => {
  const body = convertCartToPaymentData();

  axios
    .post("http://localhost:8080/pages/ecpay/send", body)
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
