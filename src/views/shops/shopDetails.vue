<template>
  <div>
    <h2>訂單資訊</h2>
    <div v-if="loading">
      <p>正在加載訂單信息...</p>
    </div>
    <div v-else-if="error">
      <p class="error">{{ error }}</p>
    </div>
    <div v-else>
      <div class="order-container">
        <div v-for="order in orderList" :key="order.orderId" class="order-item">
          <p>訂單編號: {{ order.orderId }}</p>
          <p>收貨地址: {{ order.shippingAddress }}</p>
          <p>訂單建立日期: {{ order.orderDate }}</p>
          <p>總金額: {{ order.finalPrice }} 元</p>
          <p>訂單狀態: <span :class="getStatusClass(order.orderStatus)">{{ order.orderStatus }}</span></p>
          <ul>
            <li v-for="item in order.orderItems" :key="item.orderItemId">
              {{ item.productName ? item.productName : '未知商品' }} - 單價: {{ item.purchasedPrice }} 元，數量: {{ item.orderQuantity }}
            </li>
          </ul>
          <button @click="cancelOrder(order.orderId)" :disabled="order.orderStatus !== '備貨中'">取消訂單</button>
          <button @click="goToPayment(order)">前往支付</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/order"; // 引入 Pinia store
import axios from "axios";

const router = useRouter();
const orderStore = useOrderStore(); // 使用 Pinia store
const apiUrl = import.meta.env.VITE_API_URL;

const orderList = ref([]);
const loading = ref(false);
const error = ref(null);

// 假設 memberId 已經在 Pinia store 或其他地方獲得，這裡為範例設置 memberId
const memberId = 1;  // 這可以從 Pinia 或當前用戶上下文中獲取

// 讀取訂單資料
const fetchOrderData = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${apiUrl}/orders/member/${memberId}`);
    orderList.value = response.data.map(order => ({
      ...order,
      orderItems: order.orderItems.map(item => ({
        ...item,
        productName: item.productName || '未知商品'
      }))
    }));
  } catch (err) {
    error.value = "無法加載訂單資料，請稍後重試";
    console.error("訂單數據加載錯誤:", err);
  } finally {
    loading.value = false;
  }
};

// 訂單狀態顏色分類
const getStatusClass = (status) => {
  switch (status) {
    case "已結帳":
      return "status-paid";
    case "備貨中":
      return "status-processing";
    case "庫存不足，請跟客服聯繫":
      return "status-out-of-stock";
    case "已發貨":
      return "status-shipped";
    case "已到貨":
      return "status-delivered";
    default:
      return "";
  }
};

// 取消訂單（僅允許在備貨中取消）
const cancelOrder = async (orderId) => {
  if (confirm("確定要取消該訂單嗎？")) {
    try {
      const response = await axios.post(`${apiUrl}/orders/cancel`, null, {
        params: { orderId }
      });
      if (response.status === 200) {
        alert("訂單已成功取消");
        fetchOrderData();
      }
    } catch (err) {
      console.error("取消訂單失敗:", err);
      alert("取消訂單失敗，請稍後重試");
    }
  }
};

// 前往支付頁面並存入 Pinia
const goToPayment = async (order) => {
  try {
    orderStore.updateSelectedOrder(order); // 更新 Pinia store
    const paymentData = {
      orderId: order.orderId,
      finalPrice: order.finalPrice,
      orderItems: order.orderItems.map(item => ({
        productId: item.productId,
        quantity: item.orderQuantity,
        purchasedPrice: item.purchasedPrice,
      })),
    };
    const paymentResponse = await axios.post(`${apiUrl}/pages/ecpay/send`, paymentData);
    if (paymentResponse.status === 200) {
      router.push("/shop/payment");
    } else {
      alert("支付處理失敗，請稍後重試！");
    }
  } catch (error) {
    console.error("前往支付頁面失敗:", error);
    alert("支付頁面加載失敗，請稍後重試！");
  }
};

onMounted(() => {
  fetchOrderData();
});
</script>

<style scoped>
.error {
  color: red;
}

.status-paid {
  color: green;
  font-weight: bold;
}

.status-processing {
  color: orange;
  font-weight: bold;
}

.status-out-of-stock {
  color: gray;
}

.status-shipped {
  color: blue;
}

.status-delivered {
  color: purple;
}

/* 新增樣式：訂單列表顯示兩列，並加入白色背景 */
.order-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* 每行顯示兩個訂單，並根據大小調整 */
  gap: 20px; /* 訂單間距 */
}

.order-item {
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.order-item button {
  margin-top: 10px;
}
</style>
