<template>
  <div class="container">
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
          <button @click="cancelOrder(order.orderId)" :disabled="order.orderStatus !== '待支付'">取消訂單</button>
          <button @click="goToPayment(order)" :disabled="order.orderStatus !== '待支付'">前往支付</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/order"; // 引入 Pinia store
import { axiosapi3 } from "@/plugins/axios.js";

const router = useRouter();
const orderStore = useOrderStore(); // 使用 Pinia store

const orderList = ref([]);
const loading = ref(false);
const error = ref(null);

// 從 localStorage 或 sessionStorage 取得 memberId
const memberId = 1;  // 設定為 1 作為測試 ID

// 讀取訂單資料
const fetchOrderData = async () => {
  loading.value = true;
  try {
    const response = await axiosapi3.get(`/orders/member/${memberId}`);
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
    case "待支付":
      return "status-pending";
    case "備貨中":
      return "status-processing";
    case "待出貨":
      return "status-awaiting-shipping";
    case "已出貨":
      return "status-shipped";
    case "已取消":
      return "status-canceled";
    default:
      return "";
  }
};

// 取消訂單（僅允許在待支付狀態下取消）
const cancelOrder = async (orderId) => {
  if (confirm("確定要取消該訂單嗎？")) {
    try {
      const response = await axiosapi3.post(`/orders/cancel`, null, {
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
    const paymentResponse = await axiosapi3.post(`/pages/ecpay/send`, paymentData);
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

.status-pending {
  color: orange;
  font-weight: bold;
}

.status-processing {
  color: yellow;
  font-weight: bold;
}

.status-awaiting-shipping {
  color: blue;
  font-weight: bold;
}

.status-shipped {
  color: purple;
  font-weight: bold;
}

.status-canceled {
  color: gray;
  font-weight: bold;
}

/* 訂單列表置中顯示並做四項一組的樣式 */
.order-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 每行顯示四個訂單項目 */
  gap: 20px;
  justify-items: center; /* 設置每個訂單項目居中顯示 */
  padding: 20px;
}

/* 訂單項目的樣式 */
.order-item {
  background-color: white;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%; /* 確保每個訂單框寬度相等 */
  max-width: 300px; /* 設置每個訂單框最大寬度 */
}

.order-item button {
  margin-top: 10px;
}

.container {
  background-color: #ffffff;
  margin: 30px auto;
  width: 90%;
  max-width: 1200px;
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加陰影效果 */
}
</style>