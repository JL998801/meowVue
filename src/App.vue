<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { RouterView } from "vue-router";
import Navigationbar from "./views/Navigationbar.vue";
import TopButton from "./views/TopButton.vue";

const route = useRoute();
const isShopRoute = computed(() => route.path.startsWith("/shop")); // ✅ 判斷是否是商城頁面
const isLoggedIn = computed(() => !!localStorage.getItem("authToken")); // ✅ 直接計算 `isLoggedIn`
</script>

<template>
  <Navigationbar v-if="!isShopRoute" /> 
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
