<template>
  <div data-v-inspector="src/views/Cart.vue:2:3">
    <h2 data-v-inspector="src/views/Cart.vue:3:5">我的購物車</h2>
    <div v-if="cart.length === 0" data-v-inspector="src/views/Cart.vue:4:5">
      <p data-v-inspector="src/views/Cart.vue:5:7">購物車是空的！</p>
    </div>
    <div v-else data-v-inspector="src/views/Cart.vue:7:5">
      <div v-for="item in cart" :key="item.cartId" data-v-inspector="src/views/Cart.vue:8:7">
        <input 
          type="checkbox" 
          v-model="item.selected" data-v-inspector="src/views/Cart.vue:9:9" 
        />
        <p data-v-inspector="src/views/Cart.vue:13:9">
          {{ item.productName }} - 單價: {{ item.salePrice }}元 × 
          <input
            type="number"
            v-model.number="item.quantity"
            min="1"
            @change="updateQuantity(item.cartId, item.quantity)" data-v-inspector="src/views/Cart.vue:15:11"
          />
        </p>
        <button @click="removeItem(item.cartId)" data-v-inspector="src/views/Cart.vue:22:9">刪除此商品</button>
      </div>
      <div data-v-inspector="src/views/Cart.vue:24:7">
        <p data-v-inspector="src/views/Cart.vue:25:9">總金額: {{ totalPrice }}元</p>
        <button @click="clearCart" data-v-inspector="src/views/Cart.vue:26:9">一鍵清空購物車</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
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
</script>

<style scoped>
.error {
  color: red;
}
</style>
