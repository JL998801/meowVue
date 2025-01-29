<template>
  <div id="payment">
    <h2>支付頁面</h2>
    <p>確認購物車商品後，點擊下方按鈕完成支付。</p>
    <ul>
      <li v-for="item in selectedCart" :key="item.cartItemId">
        {{ item.product.productName }} - 單價: {{ item.product.salePrice }} 元，數量:
        <input type="number" v-model.number="item.quantity" min="1"
          @change="updateQuantity(item.cartItemId, item.quantity)" />
        <button @click="removeFromCart(item.cartItemId)">刪除</button>
      </li>
    </ul>
    <p><strong>總金額:</strong> {{ totalAmount }} 元</p>

    <!-- 支付按鈕 -->
    <form @submit.prevent="sendPayment">
      <button type="submit">立即支付</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import axios from "axios";

// 從環境變數中讀取 API 和 ECPay URL
const apiUrl = import.meta.env.VITE_API_URL;

// 取得 Vuex store 內的購物車
const store = useStore();
const cart = computed(() => store.state.cart);

// 篩選已選擇的商品
const selectedCart = ref([]);
watch(
  cart,
  () => {
    selectedCart.value = cart.value.filter((item) => item.selected);
  },
  { immediate: true }
);

// 計算總金額
const totalAmount = computed(() =>
  selectedCart.value.reduce((sum, item) => sum + item.product.salePrice * item.quantity, 0)
);

// 更新商品數量
const updateQuantity = (id, quantity) => {
  const item = selectedCart.value.find((item) => item.cartItemId === id);
  if (item) item.quantity = quantity;
};

// 刪除購物車商品
const removeFromCart = (id) => {
  const index = selectedCart.value.findIndex((item) => item.cartItemId === id);
  if (index > -1) selectedCart.value.splice(index, 1);
};

// 將購物車資料轉換為後端所需格式
const convertCartToPaymentData = () => {
  const name = selectedCart.value.map((item) => item.product.productName).join(", ");
  const total = totalAmount.value.toString();
  const desc = `包含 ${selectedCart.value.length} 項商品`;
  return { name, total, desc };
};

// 發送支付請求
const sendPayment = () => {
  const body = convertCartToPaymentData();

  axios
    .post(`${apiUrl}/pages/ecpay/send`, body)
    .then((response) => {
      console.log("支付請求成功，回應內容：", response.data);

      // 動態生成後端回傳的表單
      const container = document.createElement("div");
      container.id = "paymentForm";
      document.body.appendChild(container);
      container.innerHTML = response.data;

      // 執行返回的腳本以提交表單
      const script = container.querySelector("script");
      if (script) eval(script.textContent);
    })
    .catch((error) => {
      console.error("支付失敗：", error);
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
</style>
