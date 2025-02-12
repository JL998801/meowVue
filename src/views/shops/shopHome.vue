<script setup>
import { computed, defineProps, defineEmits, watch} from "vue";
import ProductCard from "@/components/shop/home/ProductCard.vue";
// import Pagination from "@/components/shop/home/Pagination.vue";
import Pagination from "../../components/shop/home/Pagination.vue"
import useProductStore from "@/stores/productStore";

const productStore = useProductStore();

// 接收子組件 ProductCard 的事件(加入購物車、願望清單)，傳遞給父組件 shopLayout；中介轉發事件，不處理業務邏輯
const emit = defineEmits(["add-to-cart", "add-to-wishlist"]);

</script>
 
<template>
  <div class="shop-home" >
    <!-- <h2>{{ isFiltering ? "搜尋結果" : "所有商品" }}</h2> -->
      <!-- 🔹 分頁控制 -->
      <div>
        <Pagination 
          v-if="productStore.totalPages > 1"
        />
      
      </div>
      <!-- 🔹 商品卡片:點擊需要傳入 product 資訊 -->
      <div class="product-grid" v-if="productStore.products.length > 0">
        <ProductCard
          displayMode="one"
          v-for="product in productStore.products"
          :key="product.productId"
          :product="product"
          @add-to-cart="emit('add-to-cart',product)"
          @add-to-wishlist="emit('add-to-wishlist', product)"
        />
      </div>
<!-- 
      @add-to-cart="emit('add-to-cart', $event)"
      @add-to-wishlist="emit('add-to-wishlist', $event)" -->

      <!-- 🔹 無結果 -->
      <div v-else-if="!productStore.loading">
        <p>沒有符合條件的商品</p>
      </div>
      
      <div v-else>
        <p>下載中</p>
      </div>
  
  </div>
</template>

<style scoped>
.shop-home {
  padding: 20px;
  margin-bottom: 20px;
  overflow: hidden; /* 防止內容區域擴展超出範圍 */
}

/* 讓下拉選單更緊湊 */
select.form-select {
  max-width: 80px;
}

/* 商品卡片排版 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

/* 分頁控制 */
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.carousel-container {
  display: flex;
  flex-direction: column; /* 讓每個 Carousel 區塊獨立一行 */
  gap: 20px; /* 設定間距 */
}

.carousel-item {
  width: 100%; /* 讓每個類別區塊佔滿 */
  text-align: center;
}
</style>
