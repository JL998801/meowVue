<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { RouterLink, RouterView } from 'vue-router';
import { useRoute, useRouter } from "vue-router";
import useUserStore from "@/stores/user";
import Navigationbar from "./views/Navigationbar.vue";
import { computed, onMounted, watchEffect  } from "vue";
import TopButton from "./views/TopButton.vue";
import Footer from "./views/Footer.vue";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

//下列程式用來監聽網址列token變化，用於line登入後擷取token並存入Pinia再存入localStorage
onMounted(() => {
   // 使用 watchEffect() 監聽 token 變化，確保提取後再清除 URL
  watchEffect(() => {
    const token = route.query.token;
    if (token) {
      console.log("Token 為:", token);
      userStore.setToken(token); // 儲存 Token
      router.replace({ path: "/", query: {} }); // 移除 Query 參數
    }
  });
});

// 定義需要全螢幕顯示的路徑
const fullWidthRoutes = ["/","/pets/MemberCenter","/pet/map", "/advanced-settings", "/admin"];

// 定義需要套用 `.admin` 樣式的頁面
const adminRoutes = [
  "/admin/rescueCase",
  "/admin/adopt-case",
  "/admin/lostCase",
  "/admin/rescueAnalysis",
  "/admin"
];

// 判斷是否應用 `admin` 樣式
const isAdminPage = computed(() => adminRoutes.includes(route.path));

// 判斷是否應用 `full-width` 樣式
const isFullWidth = computed(() => fullWidthRoutes.includes(route.path));


</script>

<template>
    <Navigationbar v-if="!$route.meta.hideNavbar"></Navigationbar>
    <div
      :class="isAdminPage ? 'admin' : isFullWidth ? 'full-width' : 'container'"
    >
      <RouterView />
    </div>
    <TopButton />
    <Footer />
</template>

<style scoped>
/* 全域樣式 */
.container {
  background-color: #ffffff;
  padding: 0 70px;
  margin: 0 auto;
  background-image: url('@/assets/背景圖2.png');
}

/* 當 `isFullWidth` 為 true，讓 `.container` 變成全寬而且不要有卷軸 */
.full-width {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh; /* ✅ 讓 `/pet/map` 和 `/advanced-settings` 頁面占滿全畫面 */
  max-width: 100%;
  max-height: 100%;
  overflow: hidden; /* ✅ 隱藏滾動條 */
}

/*管理員頁面使用樣式*/
.admin {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  max-height: 100%;
  overflow: auto; /* ✅ 允許滾動 */
}
</style>
