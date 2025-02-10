<script setup>
import { useCartStore } from "@/stores/cart";

const cartStore = useCartStore();
</script>

<template>
  <div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="cartModalLabel">購物車</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ul v-if="cartStore.cartItems.length > 0">
            <li v-for="item in cartStore.cartItems" :key="item.productId">
              <img :src="item.imageUrls?.[0]" :alt="item.productName" width="50" />
              {{ item.productName }} - {{ item.quantity }} 件
            </li>
          </ul>
          <p v-else>購物車是空的</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>
