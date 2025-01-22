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
          />
        </p>
        <button @click="removeItem(item.cartId)">刪除此商品</button>
      </div>
      <div>
        <p>總金額: {{ totalPrice }}元</p>
        <button @click="clearCart">一鍵清空購物車</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();
const cart = computed(() => store.state.cart || []);  // 防止cart为undefined

// 计算总金额（仅计算选中的商品）
const totalPrice = computed(() => {
  if (!cart.value.length) return 0;
  return cart.value
    .filter(item => item.selected)
    .reduce((total, item) => total + (item.product?.salePrice || 0) * item.quantity, 0);
});

// 更新商品数量
const updateQuantity = async (item) => {
  if (item.quantity < 1 || isNaN(item.quantity)) {
    alert('商品數量不能小於1');
    item.quantity = 1;
    return;
  }

  try {
    await axios.put(`http://localhost:8080/pages/cart/update`, {
      cartId: item.cartId,
      quantity: item.quantity
    });
    store.dispatch('updateQuantity', { cartId: item.cartId, quantity: item.quantity });
  } catch (error) {
    console.error('更新購物車數量失敗:', error);
    alert('更新購物車數量失敗，請稍後重試！');
  }
};

// 删除购物车商品
const removeItem = async (cartId) => {
  if (confirm('確定要刪除此商品嗎？')) {
    try {
      await axios.delete(`http://localhost:8080/pages/cart/delete/${cartId}`);
      store.dispatch('removeFromCart', cartId);
    } catch (error) {
      console.error('刪除商品失敗:', error);
      alert('刪除商品失敗，請稍後重試！');
    }
  }
};

// 清空购物车
const clearCart = async () => {
  if (confirm('確定要清空購物車嗎？')) {
    try {
      await axios.delete('http://localhost:8080/pages/cart/clear');
      store.dispatch('clearCart');
    } catch (error) {
      console.error('清空購物車失敗:', error);
      alert('清空購物車失敗，請稍後重試！');
    }
  }
};

// 更新选中状态
const updateSelection = async (item) => {
  try {
    store.commit('setSelected', { cartId: item.cartId, selected: item.selected });  // 使用 commit 而不是 dispatch
  } catch (error) {
    console.error('更新選擇狀態失敗:', error);
    alert('更新選擇狀態失敗，請稍後重試！');
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
