<script setup>
import { computed } from "vue";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const router = useRouter();

// 使用 computed 來確保內容即時變更
const cartItems = computed(() => cartStore.cartItems);

// 觸發 Vue 更新
const refreshCart = () => {
  cartStore.$patch({ cartItems: [...cartStore.cartItems] }); 
};

// 跳轉到購物車頁面
const goToCart = () => {
  router.push("/cart");
};

// **頁面加載時獲取購物車數據**
onMounted(() => {
  cartStore.fetchCart();
});
</script>

<template>
  <div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true" 
  @shown.bs.modal="refreshCart">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="cartModalLabel">購物車</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ul v-if="cartItems.length > 0">
            <li v-for="item in cartItems" :key="item.productId">
              <img :src="item.imageUrls?.[0]" :alt="item.productName" width="50" />
              {{ item.productName }} - {{ item.quantity }} 件
            </li>
          </ul>
          <p v-else>購物車是空的</p>
        </div>
        <div class="modal-footer">
          <div class="total">
          <span>總金額: {{ totalPrice }}元</span>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
          </div>
          <button class="go-to-cart-btn" @click="goToCart">前往購物車</button>
        </div>
      </div>
    </div>
  </div>
</template>
