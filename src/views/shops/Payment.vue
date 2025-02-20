<template>
  <div class="payment-container">
    <h2>支付頁面</h2>
    <p>請確認訂單內容，點擊「立即支付」進行付款。</p>

    <div v-if="!selectedOrder">
      <p class="error">無法獲取訂單信息，請返回訂單頁面重新選擇。</p>
    </div>

    <div v-else>
      <div class="order-details">
        <p><strong>訂單編號:</strong> {{ selectedOrder.orderId }}</p>
        <p><strong>總金額:</strong> {{ selectedOrder.finalPrice }} 元</p>
        <ul>
          <li v-for="item in selectedOrder.orderItems" :key="item.orderItemId">
            {{ item.productName }} - 單價: {{ item.purchasedPrice }} 元，數量: {{ item.orderQuantity }}
          </li>
        </ul>
      </div>

      <form @submit.prevent="sendPayment">
        <button type="submit" :disabled="!selectedOrder">立即支付</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useOrderStore } from "@/stores/order"; // 引入 Pinia store
import { axiosapi3 } from "@/plugins/axios.js";

const orderStore = useOrderStore();

// 計算屬性：獲取選中的訂單
const selectedOrder = computed(() => orderStore.selectedOrder);

// 準備支付資料
const getPaymentData = () => {
  if (!selectedOrder.value) {
    console.error("❌ 無選擇訂單！");
    return null;
  }

  const paymentData = {
    orderId: selectedOrder.value.orderId,
    total: String(selectedOrder.value.finalPrice), // 確保為字串
    name: selectedOrder.value.orderItems.map((item) => item.productName).join(", "),
    desc: `包含 ${selectedOrder.value.orderItems.length} 項商品`
  };

  console.log("✅ 準備的支付資料：", paymentData);
  return paymentData;
};

// 發送支付請求
const sendPayment = async () => {
  console.log("📤 發送支付請求...");

  const paymentData = getPaymentData();
  if (!paymentData) {
    alert("❌ 訂單資料缺失，請返回訂單頁面重新選擇！");
    return;
  }

  try {
    // 使用 x-www-form-urlencoded 格式發送資料
    const formData = new URLSearchParams();
    formData.append("orderId", paymentData.orderId);
    formData.append("total", paymentData.total);
    formData.append("name", paymentData.name);
    formData.append("desc", paymentData.desc);

    console.log("📤 送出的支付請求內容：", formData.toString());

    const response = await axiosapi3.post(`/pages/ecpay/send`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    console.log("✅ 支付 API 回應：", response.data);

    if (!response.data) {
      console.error("❌ 支付 API 無回應數據！");
      alert("支付回應異常，請稍後重試！");
      return;
    }

    // 解析 HTML，創建支付表單
    const container = document.createElement("div");
    container.innerHTML = response.data;
    document.body.appendChild(container);

    // 查找並提交表單
    const paymentForm = container.querySelector("form");
    if (paymentForm) {
      console.log("📩 找到支付表單，提交中...");
      paymentForm.submit();
    } else {
      console.error("❌ 未找到支付表單！");
      alert("支付表單異常，請稍後重試！");
    }
  } catch (error) {
    console.error("❌ 支付請求失敗：", error);

    if (error.response) {
      console.error("❌ 伺服器錯誤回應：", error.response.data);
      alert(`❌ 支付請求失敗，錯誤：${error.response.data.message || "未知錯誤"}`);
    } else if (error.request) {
      console.error("❌ 未收到伺服器回應：", error.request);
      alert("❌ 無法連接到支付伺服器，請稍後重試！");
    } else {
      console.error("❌ 設置請求時發生錯誤：", error.message);
      alert("❌ 支付請求異常，請稍後重試！");
    }
  }
};
</script>

<style scoped>
/* ✅ 支付頁面容器 */
.payment-container {
  max-width: 1200px; /* 設定最大寬度 */
  width: 90%; /* 在小螢幕時佔 90% */
  margin: 0 auto; /* 讓內容置中 */
  padding: 20px;
  background: white;
  border-radius: 10px; /* 增加圓角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* ✅ 訂單詳情區塊 */
.order-details {
  margin-bottom: 20px;
}

.order-details p {
  margin: 10px 0;
}

.order-details ul {
  list-style-type: none;
  padding: 0;
}

.order-details li {
  margin: 5px 0;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

/* ✅ 按鈕樣式 */
button {
  background-color: #28a745;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

button:hover {
  background-color: #218838;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* ✅ 錯誤訊息樣式 */
.error {
  color: red;
  font-weight: bold;
}

/* ✅ 響應式設計 */
@media (max-width: 768px) {
  .payment-container {
    padding: 15px;
  }

  button {
    width: 100%; /* 手機版按鈕佔滿寬度 */
    padding: 10px;
  }
}
</style>