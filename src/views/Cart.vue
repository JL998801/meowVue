<template>
  <div>
    <h2>我的購物車</h2>
    <div v-if="cart.length === 0">
      <p>購物車是空的！</p>
    </div>
    <div v-else>
      <div v-for="item in cart" :key="item.cartItemId">
        <input type="checkbox" v-model="item.selected" @change="updateSelection(item)" />
        <p>
          {{ item.product?.productName || '商品名稱加載中...' }} - 單價:
          {{ item.product?.salePrice || 0 }}元 ×
          <!-- 顯示不可編輯的商品數量 -->
          <span>{{ item.quantity }}</span>
        </p>
        <!-- 可編輯數量的輸入框 -->
        <input type="number" v-model.number="item.editQuantity" min="1" @input="validateInput(item)" />
        <button @click="increaseQuantity(item)">增加數量</button>
        <button @click="removeItem(item.cartItemId)">刪除此商品</button>
      </div>
      <div>
        <p>總金額: {{ totalPrice }}元</p>
        <button @click="clearCart">一鍵清空購物車</button>
      </div>
      <button @click="goToPayment">前往交易明細</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

// 從環境變數中讀取 API
const apiUrl = import.meta.env.VITE_API_URL;

const store = useStore();
const router = useRouter();
const cart = computed(() => store.state.cart || []);  // 防止 cart 為 undefined

// 計算總金額（僅計算選中的商品）
const totalPrice = computed(() => {
  if (!cart.value.length) return 0;
  return cart.value
    .filter(item => item.selected)
    .reduce((total, item) => total + (item.product?.salePrice || 0) * item.quantity, 0);
});

// 更新商品數量
const updateQuantity = async (item) => {
  if (item.editQuantity < 1 || isNaN(item.editQuantity)) {
    alert('商品數量不能小於1');
    item.editQuantity = item.quantity;  // 恢復為原來的數量
    return;
  }

  try {
    const memberId = store.state.memberId;
    const productId = item.product.productId; // Assuming productId exists
    // 發送更新數量的請求
    await axios.post(`${apiUrl}/pages/cart/add`, {
      memberId: memberId,
      productId: productId,
      quantity: item.editQuantity,
    });
    store.dispatch('updateQuantity', { cartItemId: item.cartItemId, quantity: item.editQuantity });
    await store.dispatch('fetchCartDataFromServer');  // 重新獲取購物車資料
  } catch (error) {
    console.error('更新購物車數量失敗:', error);
    alert('更新購物車數量失敗，請稍後重試！');
  }
};

// 增加商品數量
const increaseQuantity = async (item) => {
  item.editQuantity++;  // 編輯數量增加
  await updateQuantity(item);  // 確保增量後同步更新後端
};

// 清空購物車
const clearCart = async () => {
  if (confirm('確定要清空購物車嗎？')) {
    try {
      const memberId = store.state.memberId;
      await axios.delete(`${apiUrl}/pages/cart/clear/${memberId}`);
      store.dispatch('clearCart');
      await store.dispatch('fetchCartDataFromServer');  // 重新獲取購物車資料
    } catch (error) {
      console.error('清空購物車失敗:', error);
      alert('清空購物車失敗，請稍後重試！');
    }
  }
};

// 更新選中狀態
const updateSelection = async (item) => {
  try {
    store.commit('setSelected', { cartItemId: item.cartItemId, selected: item.selected });
  } catch (error) {
    console.error('更新選擇狀態失敗:', error);
    alert('更新選擇狀態失敗，請稍後重試！');
  }
};

// 刪除商品
const removeItem = async (cartItemId) => {
  if (cartItemId && confirm('確定要刪除此商品嗎？')) {
    try {
      // 確保刪除請求成功後更新前端
      await axios.delete(`${apiUrl}/pages/cart/delete/${cartItemId}`);
      store.dispatch('removeFromCart', cartItemId);
      await store.dispatch('fetchCartDataFromServer');  // 重新獲取購物車資料
    } catch (error) {
      console.error('刪除商品失敗:', error);
      alert('刪除商品失敗，請稍後重試！');
    }
  }
};

// 前往支付頁面
const goToPayment = () => {
  router.push('/shop/details');
};

// 檢查並修正用戶輸入的數量
const validateInput = (item) => {
  if (item.editQuantity < 1 || isNaN(item.editQuantity)) {
    alert('請輸入正確的商品數量');
    item.editQuantity = item.quantity; // 恢復為原來的數量
  }
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
