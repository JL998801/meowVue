<template>
  <div id="shop-layout">
    <!-- 商城的主要內容 -->
    <main>
      <router-view /> <!-- ✅ 載入 `ShopHome.vue` 或其他商城頁面 -->
    </main>

    <!-- 商城專用 Footer -->
    <footer>
      <p>© 2024 壁爐之家商城. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
#shop-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
  padding: 20px;
}

footer {
  background: #f8f9fa;
  text-align: center;
  padding: 10px;
  margin-top: 20px;
}
</style>
