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

// Get API URL from environment variables
const apiUrl = import.meta.env.VITE_API_URL;

// Vuex store to manage selected order
const store = useStore();

// Computed property to get selected order from Vuex
const selectedOrder = computed(() => store.state.selectedOrder);

// Prepare payment data based on selected order
const getPaymentData = () => {
  if (!selectedOrder.value) return null;

  return {
    orderId: selectedOrder.value.orderId,
    amount: selectedOrder.value.finalPrice, // 確保欄位名稱與後端一致
    productName: selectedOrder.value.orderItems.map((item) => item.productName).join(", ")
  };
};

// Handle sending the payment request
const sendPayment = async () => {
  const paymentData = getPaymentData();
  
  if (!paymentData) {
    alert("訂單資料缺失，請返回訂單頁面重新選擇！");
    return;
  }

  try {
    const response = await axios.post(`${apiUrl}/pages/ecpay/send`, paymentData, {
      headers: {
        "Content-Type": "application/json" // 確保 Content-Type 為 application/json
      }
    });
    
    // 假設 response 返回的是 HTML 表單，用於提交支付請求
    const container = document.createElement("div");
    container.innerHTML = response.data;
    document.body.appendChild(container);
    const script = container.querySelector("script");
    if (script) eval(script.textContent);  // 執行綠界付款的提交腳本
  } catch (error) {
    console.error("支付失敗：", error);
    alert("支付請求失敗，請稍後重試！");
  }
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
