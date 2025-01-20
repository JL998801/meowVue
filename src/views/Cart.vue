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
        />
        <p>
          {{ item.productName }} - 單價: {{ item.salePrice }}元 × 
          <input
            type="number"
            v-model.number="item.quantity"
            min="1"
            @change="updateQuantity(item.cartId, item.quantity)"
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
import { computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();
const cart = computed(() => store.state.cart);

// 計算總金額，只計算選中的商品
const totalPrice = computed(() => {
  return cart.value.filter(item => item.selected).reduce((total, item) => total + item.salePrice * item.quantity, 0);
});

// 刪除購物車中的商品
const removeItem = async (id) => {
  store.dispatch('removeFromCart', id);
  await updateCartOnServer();
};

// 清空購物車
const clearCart = async () => {
  if (window.confirm("確定要清空購物車嗎？")) {
    store.dispatch('clearCart');
    await updateCartOnServer();
  }
};

// 更新商品數量
const updateQuantity = async (id, quantity) => {
  store.dispatch('updateQuantity', { id, quantity });
  await updateCartOnServer();
};

// 同步購物車資料到後端
const updateCartOnServer = async () => {
  try {
    const cartData = cart.value.map(item => ({
      cartId: item.cartId,
      productId: item.productId,
      quantity: item.quantity,
      selected: item.selected // 發送選中狀態
    }));
    await axios.put('http://localhost:8080/pages/cart/update', cartData); // 修改為正確的 API 路徑
  } catch (error) {
    console.error('Error updating cart on server:', error);
  }
};

// 監控購物車狀態變化，並將變化同步到後端
watch(cart, async () => {
  await updateCartOnServer();
}, { deep: true });

// 在組件加載時，獲取購物車資料
onMounted(() => {
  store.dispatch('syncCartWithServer');
  fetchCartData();
});

// 根據 memberId 查詢購物車資料
const fetchCartData = async () => {
  try {
    const memberId = 1; // 假設是會員ID 1，你可以根据当前登录用户动态获取
    const response = await axios.get(`http://localhost:8080/pages/cart/list/${memberId}`);
    store.commit('setCart', response.data); // 使用 commit 而不是 dispatch
  } catch (error) {
    console.error('Error fetching cart data:', error);
  }
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
