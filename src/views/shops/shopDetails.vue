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
      <ul>
        <li v-for="order in orderList" :key="order.orderId">
          <p>訂單編號: {{ order.orderId }}</p>
          <p>收貨地址: {{ order.shippingAddress }}</p>
          <p>訂單建立日期: {{ order.orderDate }}</p>
          <p>總金額: {{ order.finalPrice }} 元</p>
          <p>訂單狀態: <span :class="getStatusClass(order.orderStatus)">{{ order.orderStatus }}</span></p>
          <ul>
            <li v-for="item in order.orderItems" :key="item.orderItemId">
              {{ item.productName ? item.productName : '未知的商品' }} - 單價: {{ item.purchasedPrice }} 元，數量: {{ item.orderQuantity }}
            </li>
          </ul>
          <button @click="cancelOrder(order.orderId)" :disabled="order.orderStatus !== '備貨中'">取消訂單</button>
          <button 
            @click="goToPayment(order)" 
            :disabled="order.orderStatus !== '待支付'">前往支付</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";

const router = useRouter();
const store = useStore();
const apiUrl = import.meta.env.VITE_API_URL;

const orderList = ref([]);
const loading = ref(false);
const error = ref(null);

// 讀取訂單資料
const fetchOrderData = async () => {
  loading.value = true;
  error.value = null;

  // 確保 `memberId` 有值，從 Vuex 或 localStorage 取得
  const memberId = store.state.memberId || localStorage.getItem("memberId");

  if (!memberId) {
    error.value = "無法獲取會員 ID，請重新登入";
    loading.value = false;
    return;
  }
  try {
    const response = await axios.get(`${apiUrl}/orders/member/${memberId}`); // 使用反引號進行字串插值
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

// 前往支付頁面並存入 Vuex
const goToPayment = async (order) => {
  try {
    store.dispatch("updateSelectedOrder", order);
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
</style>
