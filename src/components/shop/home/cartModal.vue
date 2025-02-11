<script setup>
import { useCartStore } from "@/stores/cart";

const cartStore = useCartStore();
</script>

<template>
  <div class="small-cart-container">
    <!-- 小購物車圖示，顯示數量 -->
    <div class="cart-icon" @click="toggleCart">
      <img :src="cartIcon" alt="Shopping Cart" />
      <span v-if="cartQuantity > 0" class="cart-quantity">{{ cartQuantity }}</span> <!-- 顯示數量 -->
    </div>

    <!-- 當顯示購物車內容時顯示 -->
    <div v-if="showCart" class="cart-content">
      <button class="close-btn" @click="toggleCart">X</button> <!-- Close button -->
      <div v-if="cartItems.length === 0">
        <p>購物車是空的！</p>
      </div>
      <div v-else>
        <div v-for="item in cartItems" :key="item.cartItemId" class="cart-item">
          <!-- 顯示商品縮圖 -->
          <img v-if="item.product?.imageUrl" :src="item.product.imageUrl" alt="Product Image"
            class="product-image" />
          <p>
            {{ item.product?.productName || '商品名稱加載中...' }} - 單價:
            {{ item.product?.salePrice || 0 }}元 ×
            <span>{{ item.quantity }}</span>
          </p>
        </div>
        <div class="total">
          <span>總金額: {{ totalPrice }}元</span>
        </div>
        <button class="go-to-cart-btn" @click="goToCart">前往購物車</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from "@/stores/cart";

export default {
  data() {
    return {
      showCart: false, // 控制顯示購物車
      cartIcon: "path_to_cart_icon.png", // 圖示路徑，根據需要調整
    };
  },
  computed: {
    cartItems() {
      const cartStore = useCartStore();
      return cartStore.cartItems;
    },
    cartQuantity() {
      return this.cartItems.length; // 顯示購物車商品數量
    },
    totalPrice() {
      const cartStore = useCartStore();
      return cartStore.cartTotalPrice; // 顯示總金額
    },
  },
  methods: {
    toggleCart() {
      this.showCart = !this.showCart; // 切換購物車顯示/隱藏
    },
    goToCart() {
      this.$router.push("/cart"); // 前往購物車頁面，根據實際路徑調整
    },
  },
  created() {
    const cartStore = useCartStore();
    cartStore.fetchCart(); // 頁面加載時抓取購物車數據
  },
};
</script>

<style scoped>
/* 根據需要添加樣式 */
</style>

