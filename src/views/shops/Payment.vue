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
<<<<<<< HEAD
        <button type="submit" :disabled="!selectedOrder">立即支付</button>
=======
        <button type="submit">立即支付</button>
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useOrderStore } from "@/stores/order"; // Import Pinia store
<<<<<<< HEAD
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
=======
import { axiosapi } from "@/plugins/axios.js";


// Pinia store to manage selected order
const orderStore = useOrderStore();

// Computed property to get selected order from Pinia
const selectedOrder = computed(() => orderStore.selectedOrder);

// Prepare payment data based on selected order
const getPaymentData = () => {
  if (!selectedOrder.value) return null;

  return {
    orderId: selectedOrder.value.orderId,
    total: selectedOrder.value.finalPrice.toString(),
    name: selectedOrder.value.orderItems.map((item) => item.productName).join(", "),
    desc: `包含 ${selectedOrder.value.orderItems.length} 項商品`
  };
};

// Handle sending the payment request
const sendPayment = () => {
  const paymentData = getPaymentData();
  
  if (!paymentData) {
    alert("訂單資料缺失，請返回訂單頁面重新選擇！");
    return;
  }

  // Convert the data to x-www-form-urlencoded format
  const formData = new URLSearchParams();
  formData.append("orderId", paymentData.orderId);
  formData.append("total", paymentData.total);
  formData.append("name", paymentData.name);
  formData.append("desc", paymentData.desc);

  // Use x-www-form-urlencoded to send the data
  axiosapi.post(`/pages/ecpay/send`, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded" // Ensure the content type is x-www-form-urlencoded
      }
    })
    .then((response) => {
      // Assuming the response contains HTML form to trigger the payment
      const container = document.createElement("div");
      container.innerHTML = response.data;

      // Append the form to the body
      document.body.appendChild(container);

      // Find the form inside the container and submit it manually
      const paymentForm = container.querySelector("form");
      if (paymentForm) {
        paymentForm.submit(); // Submit the form to initiate the payment process
      }
    })
    .catch((error) => {
      console.error("支付失敗：", error);
      alert("支付請求失敗，請稍後重試！");
    });
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
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

<<<<<<< HEAD
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

=======
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
.error {
  color: red;
}
</style>
