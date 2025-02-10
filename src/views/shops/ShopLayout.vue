<template> 
  <div id="shop-app">
    <header>
      <h1>歡迎來到我的購物網站</h1>
      <nav>
        <RouterLink to="/shop">寵物商品</RouterLink>
        <RouterLink to="/shop/cart">購物車</RouterLink>
        <RouterLink to="/shop/details">交易明細</RouterLink>
        <RouterLink to="/shop/payment">支付</RouterLink>
        <RouterLink to="/admin/orders">管理訂單</RouterLink> <!-- 修正 -->
      </nav>

      <!-- 小購物車，放在 header 中 -->
      <SmallCart />
    </header>

    <!-- 顯示子路由內容 -->
    <router-view />
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import SmallCart from '../../components/SmallCart.vue'; // 引入小購物車組件
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}

#shop-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: #343a40;
  color: white;
  padding: 20px;
  text-align: center;
}

nav {
  margin-top: 15px;
}

nav a {
  margin: 0 20px;
  text-decoration: none;
  color: #007bff;
  font-size: 18px;
}

nav a:hover {
  text-decoration: underline;
}
</style>
