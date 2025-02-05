<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { RouterLink, RouterView } from 'vue-router';
import Navigationbar from "./views/Navigationbar.vue";
import ShopNavBar from "@/components/ShopNavBar.vue"; // 商城專用導覽列
import TopButton from "./views/TopButton.vue";

const route = useRoute();
const isShopRoute = computed(() => route.path.startsWith("/shop"));  // 判斷是否從商城路徑進入

</script>

<template>
<Navigationbar v-if="!isShopRoute" />
<ShopNavBar v-if="isShopRoute" />  <!--若從商城按鈕進入-->
<RouterView /> 
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
