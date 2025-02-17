<template>
  <div>
    <h1>訂單管理</h1>
    <table>
      <thead>
        <tr>
          <th>訂單 ID</th>
          <th>會員 ID</th>
          <th>訂單狀態</th>
          <th>變更狀態</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.orderId" class="order-row">
          <td>{{ order.orderId }}</td>
          <td v-if="order.memberId">{{ order.memberId }}</td>
          <td v-else>無會員ID</td>
          <td>{{ order.orderStatus }}</td>
          <td>
            <select v-model="order.newStatus">
              <!-- 根據當前訂單狀態來顯示下拉選項 -->
              <option v-if="order.orderStatus === '已付款'" value="備貨中">備貨中</option>
              <option v-if="order.orderStatus === '備貨中'" value="出貨中">出貨中</option>
              <option v-if="order.orderStatus === '出貨中'" value="已到貨">已到貨</option>
            </select>
            <button @click="updateStatus(order)" :disabled="isUpdateDisabled(order)">更新</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'; // 引用 axios

// 假設 apiUrl 是一個全域變數或是從 .env 檔案取得
const apiUrl = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      orders: [], // 儲存所有訂單
    };
  },
  methods: {
    // 取得所有訂單資料
    async fetchOrders() {
      try {
        const response = await axios.get(`${apiUrl}/orders/admin`); // 使用 axios 發送請求
        this.orders = response.data.map(order => ({
          ...order,
          newStatus: order.orderStatus, // 預設選擇當前狀態
        }));
        // 根據訂單狀態自動選定下一步狀態
        this.orders.forEach(order => {
          if (order.orderStatus === "已付款") {
            order.newStatus = "備貨中";
          } else if (order.orderStatus === "備貨中") {
            order.newStatus = "出貨中";
          } else if (order.orderStatus === "出貨中") {
            order.newStatus = "已到貨";
          }
        });
      } catch (error) {
        console.error("獲取訂單資料失敗:", error);
      }
    },
    // 更新訂單狀態
    async updateStatus(order) {
      try {
        const response = await axios.put(`${apiUrl}/orders/${order.orderId}`, {
          orderStatus: order.newStatus,
        });
        if (response.status === 200) {
          alert("狀態更新成功");
          this.fetchOrders(); // 更新訂單列表
        } else {
          alert("狀態更新失敗");
        }
      } catch (error) {
        console.error("更新訂單狀態失敗:", error);
        alert("狀態更新失敗");
      }
    },
    // 判斷按鈕是否可用
    isUpdateDisabled(order) {
      // 如果訂單狀態是「已到貨」，則禁用按鈕
      if (order.orderStatus === '已到貨') {
        return true;
      }
      if (order.orderStatus === '已付款' && order.newStatus !== '備貨中') {
        return true;
      }
      if (order.orderStatus === '備貨中' && order.newStatus !== '出貨中') {
        return true;
      }
      if (order.orderStatus === '出貨中' && order.newStatus !== '已到貨') {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.fetchOrders(); // 初始載入訂單資料
  },
};
</script>

<style scoped>
.order-row {
  background-color: white; /* 每一行背景為白色 */
  border-bottom: 1px solid #ddd; /* 增加行間分隔線 */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
}

select {
  padding: 5px;
}

button {
  padding: 5px 10px;
  margin-left: 5px;
}
</style>
