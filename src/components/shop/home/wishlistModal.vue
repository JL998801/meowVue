<script setup>
import { useWishListStore } from "@/stores/wishlist";

const wishListStore = useWishListStore();

// **載入願望清單**
wishListStore.fetchWishList();

// **移除願望清單商品**
const removeFromWishList = (productId) => {
  wishListStore.removeFromWishList(productId);
};
</script>

<template>
  <div class="modal fade" id="wishListModal" tabindex="-1" aria-labelledby="wishListModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="wishListModalLabel">願望清單</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <ul v-if="wishListStore.wishListItems.length > 0">
            <li v-for="item in wishListStore.wishListItems" :key="item.productId">
              <img :src="item.imageUrls?.[0]" :alt="item.productName" width="50" class="me-2" />
              {{ item.productName }}
              <button @click="removeFromWishList(item.productId)" class="btn btn-sm btn-danger ms-2">
                移除
              </button>
            </li>
          </ul>
          <p v-else>願望清單是空的</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
        </div>
      </div>
    </div>
  </div>
</template>
