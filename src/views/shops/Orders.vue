<template>
  <div>
    <h1>訂單管理</h1>
    <table>
      <thead>
        <tr>
          <th>訂單 ID</th>
          <th>會員 ID</th>
          <th>查看明細</th>
          <th>訂單狀態</th>
          <th>變更狀態</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.orderId" class="order-row" style="position: relative;">
    <td>{{ order.orderId }}</td>
    <td v-if="order.memberId"> {{ order.memberId }} </td>
    <td v-else>無會員ID</td>
          <td>
            <button @click="viewDetails(order)">查看明細</button>
            <!-- Details display on the left of the button -->
            <div v-if="selectedOrder === order" class="order-details">
              <p>訂單編號: {{ order.orderId }}</p>
              <p>收貨地址: {{ order.shippingAddress }}</p>
              <p>訂單建立日期: {{ order.orderDate }}</p>
              <p>總金額: {{ order.finalPrice }} 元</p>
              <p>訂單狀態: <span :class="getStatusClass(order.orderStatus)">{{ order.orderStatus }}</span></p>
            </div>
          </td>
          <td>{{ order.orderStatus }}</td>
          <td>
            <select v-model="order.newStatus">
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
<<<<<<< HEAD
import { axiosapi3 } from "@/plugins/axios.js";
=======
import { axiosapi } from "@/plugins/axios.js";
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086

export default {
  data() {
    return {
      orders: [],
      selectedOrder: null, // Store the currently selected order for viewing details
    };
  },
  methods: {
    async fetchOrders() {
      try {
<<<<<<< HEAD
        const response = await axiosapi3.get(`/orders/admin`);
=======
        const response = await axiosapi.get(`/orders/admin`);
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
        this.orders = response.data.map(order => ({
          ...order,
          newStatus: order.orderStatus,
        }));
      } catch (error) {
        console.error("獲取訂單資料失敗:", error);
      }
    },
    async updateStatus(order) {
      try {
<<<<<<< HEAD
        const response = await axiosapi3.put(`/orders/${order.orderId}`, {
=======
        const response = await axiosapi.put(`/orders/${order.orderId}`, {
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
          orderStatus: order.newStatus,
        });
        if (response.status === 200) {
          alert("狀態更新成功");
          this.fetchOrders();
        } else {
          alert("狀態更新失敗");
        }
      } catch (error) {
        console.error("更新訂單狀態失敗:", error);
        alert("狀態更新失敗");
      }
    },
    isUpdateDisabled(order) {
      if (order.orderStatus === '已到貨') return true;
      if (order.orderStatus === '已付款' && order.newStatus !== '備貨中') return true;
      if (order.orderStatus === '備貨中' && order.newStatus !== '出貨中') return true;
      if (order.orderStatus === '出貨中' && order.newStatus !== '已到貨') return true;
      return false;
    },
    viewDetails(order) {
      this.selectedOrder = this.selectedOrder === order ? null : order;
    },
    getStatusClass(status) {
      return {
        'status-paid': status === '已付款',
        'status-processing': status === '備貨中',
        'status-shipped': status === '出貨中',
        'status-delivered': status === '已到貨'
      };
    }
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style scoped>
.order-row {
  background-color: white;
  border-bottom: 1px solid #ddd;
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

.order-details {
  position: absolute;
  top: 0;
  right: 100%; /* This makes it appear on the left side */
  margin-right: 10px;
  background-color: white;
  border: 1px solid #ddd;
  padding: 10px;
  width: 200px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  font-size: 12px;
}

.status-paid { color: blue; }
.status-processing { color: orange; }
.status-shipped { color: green; }
.status-delivered { color: gray; }
</style>
