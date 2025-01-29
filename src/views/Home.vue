<template>
  <div>
    <h3>首頁 {{ userStore.email }}</h3> <!-- User email dynamically displayed -->
    <div>
      <button>救援通報</button>
      <button>認養通報</button>
      <button>遺失通報</button>
      <button>寵物商城</button>
      <button>救援活動</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';
</script>

<style scoped>
.products {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
</style>
