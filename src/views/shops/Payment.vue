<template>
  <div id="payment">
    <h2>支付頁面</h2>
    <p>請確認訂單內容，點擊「立即支付」進行付款。</p>

    <div v-if="!selectedOrder">
      <p class="error">無法獲取訂單信息，請返回訂單頁面重新選擇。</p>
    </div>

    <div v-else>
      <p><strong>訂單編號:</strong> {{ selectedOrder.orderId }}</p>
      <p><strong>總金額:</strong> {{ selectedOrder.finalPrice }} 元</p>
      <ul>
        <li v-for="item in selectedOrder.orderItems" :key="item.orderItemId">
          {{ item.productName }} - 單價: {{ item.purchasedPrice }} 元，數量: {{ item.orderQuantity }}
        </li>
      </ul>
      
      <form @submit.prevent="sendPayment">
        <button type="submit">立即支付</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import axios from "axios";

const store = useStore();
const apiUrl = import.meta.env.VITE_API_URL;

// 從 Vuex 取得選擇的訂單
const selectedOrder = computed(() => store.state.selectedOrder);

// 構造支付請求所需的數據
const getPaymentData = () => {
  if (!selectedOrder.value) return null;

  return {
    orderId: selectedOrder.value.orderId,
    total: selectedOrder.value.finalPrice.toString(),
    name: selectedOrder.value.orderItems.map((item) => item.productName).join(", "),
    desc: `包含 ${selectedOrder.value.orderItems.length} 項商品`
  };
};

// 發送支付請求
const sendPayment = () => {
  const paymentData = getPaymentData();
  
  if (!paymentData) {
    alert("訂單資料缺失，請返回訂單頁面重新選擇！");
    return;
  }

  axios
    .post(`${apiUrl}/pages/ecpay/send`, paymentData)
    .then((response) => {
      const container = document.createElement("div");
      container.innerHTML = response.data;
      document.body.appendChild(container);
      const script = container.querySelector("script");
      if (script) eval(script.textContent);
    })
    .catch((error) => {
      console.error("支付失敗：", error);
      alert("支付請求失敗，請稍後重試！");
    });
};
</script>

<style scoped>
#payment {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #218838;
}

.error {
  color: red;
}
</style>
