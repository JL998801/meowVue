<script setup>
import { ref,computed, provide, onMounted,watchEffect } from "vue";
import { useRoute,useRouter } from "vue-router";
import { RouterLink, RouterView } from 'vue-router';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navigationbar from "./views/Navigationbar.vue";
import TopButton from "./views/TopButton.vue";

const router = useRouter(); // 頁面挑轉
const route = useRoute(); // 取得路由參數
const isShopRoute = computed(() => route.path.startsWith("/shop"));  // 判斷是否從商城路徑進入
const isLoggedIn = ref(false);

// ✅ 檢查登入狀態 (從 localStorage 取得 token)
const checkAuth = () => {
  isLoggedIn.value = !!localStorage.getItem("authToken");
};

// ✅ 頁面載入時檢查登入狀態
onMounted(() => {
  checkAuth();
  isLoggedIn.value = !!localStorage.getItem("memberId");
});

// ✅ 監聽 localStorage 變更，確保狀態同步
watchEffect(() => {
  isLoggedIn.value = !!localStorage.getItem("authToken");
});

</script>

<template>
<Navigationbar v-if="!isShopRoute" />
<ShopNavBar v-if="isShopRoute" />  <!--若從商城按鈕進入-->
<router-view />
<TopButton />
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}

#app {
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
