<script setup>
import { ref,computed, onMounted, onUnmounted} from "vue";
import { useRoute } from "vue-router";
import { RouterView } from "vue-router";
import Navigationbar from "./views/Navigationbar.vue";
import ShopNavBar from "./components/shop/home/ShopNavBar.vue";
import TopButton from "./views/TopButton.vue";
import Footer from "./views/Footer.vue";

const isScrolled = ref(false); // ✅ 記錄頁面滾動狀態

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50; // ✅ 當滾動超過 50px，就縮小
};

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

//設置管理員後台不要有背景圖
watchEffect(() => {
  if (route.path.startsWith("/admin")) {
    document.body.classList.add("admin-page");  // 在 /admin 頁面加上 class
  } else {
    document.body.classList.remove("admin-page");  // 其他頁面移除 class
  }
});

// 定義需要全螢幕顯示的路徑
const fullWidthRoutes = ["/","/pages/MemberCenter","/pet/map", "/advanced-settings", "/admin","/shop"];

// 定義需要套用 `.admin` 樣式的頁面
const adminRoutes = [
  "/admin/rescueCase",
  "/admin/adopt-case",
  "/admin/lostCase",
  "/admin/rescueAnalysis",
  "/admin",
  "/adopt"
];

// 判斷是否應用 `admin` 樣式
const isAdminPage = computed(() => adminRoutes.includes(route.path));

// 判斷是否應用 `full-width` 樣式
const isFullWidth = computed(() => fullWidthRoutes.includes(route.path))|| route.path.startsWith("/shop");


</script>

<template>
    <Navigationbar v-if="!$route.meta.hideNavbar "></Navigationbar>
    <div
      :class="isAdminPage ? 'admin' : isFullWidth ? 'full-width' : 'container'"
    >
      <RouterView />
    </div>
    <TopButton />
    <Footer :class="['footer', { shrink: isScrolled }]" />
</template>

<style scoped>
/* 🔹 預設 Navbar & Footer 大小 */
.navbar, .footer {
  width: 100%;  /* ✅ 保持全寬 */
  height: 80px; /* ✅ 預設高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  transition: height 0.3s ease-in-out; /* ✅ 只改變高度，動畫順暢 */
  z-index: 1000;
}

/* 🔹 讓 Navbar 固定在頂部 */
.navbar {
  top: 0;
}

/* 🔹 讓 Footer 固定在底部 */
.footer {
  bottom: 0;
}

/* 🔹 滾動時縮小高度（但保持全寬） */
.shrink {
  height: 50px;  /* ✅ 縮小高度 */
}

</style>
