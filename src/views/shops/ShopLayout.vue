<template>
    <div id="shop-app">
      <header>
        <nav>
          <RouterLink to="/shop">商城首頁</RouterLink>
          <RouterLink to="/shop/details">商品詳細頁</RouterLink>
          <RouterLink to="/shop/cart">購物車</RouterLink>
          <RouterLink to="/shop/payment">支付</RouterLink>
        </nav>
      </header>
      <!-- 顯示子路由內容 -->
      <router-view />
    </div>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router';
  </script>
  
  <style scoped>
  body {
    font-family: Arial, sans-serif;
    background-color: #c6bc77;
    margin: 0;
    padding: 0;
  }
  
  #shop-app {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  header {
    background-color: #c6bc77;
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
    color: #716f71;
    font-size: 18px;
  }
  
  nav a:hover {
    text-decoration: underline;
  }
  </style>
  