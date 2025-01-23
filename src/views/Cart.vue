<template>
  <div>
    <h2>我的購物車</h2>
    <div v-if="cart.length === 0">
      <p>購物車是空的！</p>
    </div>
    <div v-else>
      <div v-for="item in cart" :key="item.cartId">
        <input 
          type="checkbox" 
          v-model="item.selected"
          @change="updateSelection(item)" 
        />
        <p>
          {{ item.product?.productName || '商品名稱加載中...' }} - 單價: 
          {{ item.product?.salePrice || 0 }}元 × 
          <input
            type="number"
            v-model.number="item.quantity"
            min="1"
            @change="updateQuantity(item)"
            :disabled="item.quantity < 1"
          />
        </p>
        <button @click="removeItem(item.cartId)">刪除此商品</button>
      </div>
      <div>
        <p>總金額: {{ totalPrice }}元</p>
        <button @click="clearCart">一鍵清空購物車</button>
      </div>
      <button @click="proceedToPaymentPage">前往支付頁面</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

// 從環境變數中讀取 API 和 ECPay URL
const apiUrl = import.meta.env.VITE_API_URL;
const ecpayUrl = import.meta.env.VITE_ECPAY_URL;

const store = useStore();
const cart = computed(() => store.state.cart || []);  // 防止cart為undefined

// 計算總金額（僅計算選中的商品）
const totalPrice = computed(() => {
  if (!cart.value.length) return 0;
  return cart.value
    .filter(item => item.selected)
    .reduce((total, item) => total + (item.product?.salePrice || 0) * item.quantity, 0);
});

// 更新商品數量
const updateQuantity = async (item) => {
  if (item.quantity < 1 || isNaN(item.quantity)) {
    alert('商品數量不能小於1');
    item.quantity = 1;  // Restore to 1 if invalid
    return;
  }

  try {
    await axios.put(`${apiUrl}/pages/cart/update`, {
      cartItemId: item.cartId,  
      quantity: item.quantity
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    store.dispatch('updateQuantity', { cartId: item.cartId, quantity: item.quantity });
  } catch (error) {
    console.error('更新購物車數量失敗:', error);
    alert('更新購物車數量失敗，請稍後重試！');
  }
};

// 刪除購物車商品
const removeItem = async (cartId) => {
  if (cartId && confirm('確定要刪除此商品嗎？')) {
    try {
      await axios.delete(`${apiUrl}/pages/cart/delete/${cartId}`);
      store.dispatch('removeFromCart', cartId);
    } catch (error) {
      console.error('刪除商品失敗:', error);
      alert('刪除商品失敗，請稍後重試！');
    }
  }
};

// 清空購物車
const clearCart = async () => {
  if (confirm('確定要清空購物車嗎？')) {
    try {
      const memberId = store.state.memberId;
      await axios.delete(`${apiUrl}/pages/cart/clear/${memberId}`);
      store.dispatch('clearCart');
    } catch (error) {
      console.error('清空購物車失敗:', error);
      alert('清空購物車失敗，請稍後重試！');
    }
  }
};

// 更新選中狀態
const updateSelection = async (item) => {
  try {
    store.commit('setSelected', { cartId: item.cartId, selected: item.selected });
  } catch (error) {
    console.error('更新選擇狀態失敗:', error);
    alert('更新選擇狀態失敗，請稍後重試！');
  }
};

// 前往支付頁面
const proceedToPaymentPage = () => {
  console.log("Redirecting to payment URL:", ecpayUrl);
  window.location.href = ecpayUrl;
};

// 组件挂载时获取购物车数据
onMounted(async () => {
  try {
    await store.dispatch('fetchCartDataFromServer');
  } catch (error) {
    console.error('獲取購物車數據失敗:', error);
    alert('獲取購物車數據失敗，請稍後重試！');
  }
});
</script>

<style scoped>
.error {
  color: red;
}
</style>
