<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  cartItems: Array, // ✅ 接收購物車商品列表
  cartCount: Number, // ✅ 接收購物車商品數量
});

// ✅ 導引至購物車頁面，參照shopRoute路徑
const goToCart = () => {
  router.push("/shop/cart");
};
</script>

<template>
  <!-- 🔹 Popover 內顯示購物車內容 -->
  <button
    type="button"
    class="btn btn-primary"
    data-bs-toggle="popover"
    data-bs-html="true"
    title="您的購物車"
    data-bs-content="Popover body content is set in this attribute."
  >
    🛒 購物車 ({{ cartCount }})
  </button>

  <div id="cart-popover-content" class="d-none">
    <div v-if="cartCount > 0">
      <ul class="list-group">
        <li class="list-group-item d-flex justify-content-between align-items-center" v-for="item in cartItems" :key="item.id">
          <span>{{ item.name }} x {{ item.quantity }}</span>
          <span class="badge bg-primary rounded-pill">${{ item.price * item.quantity }}</span>
        </li>
      </ul>
      <hr />
      <button class="btn btn-success w-100 mt-2" @click="goToCart">🛍️ 查看購物車</button>
    </div>
    <p v-else class="text-center text-muted">購物車是空的 🛒</p>
  </div>
</template>
