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
  window.addEventListener("scroll", handleScroll); // 🔥 監聽滾動事件
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll); // ✅ 清除事件監聽
});

const route = useRoute();
const isShopRoute = computed(() => route.path.startsWith("/shop"));
</script>

<template>
    <nav :class="['navbar', { shrink: isScrolled }]">

      <!--v-show 只是控制 display: none，所以兩個 <Navigationbar> 可能都會被渲染，只是 display: none 影響可見性。
      v-if 會根據條件來創建或銷毀 DOM 元素，避免兩個 <nav> 同時存在。 -->
        <Navigationbar v-if="!isShopRoute"></Navigationbar>
        <!-- <ShopNavBar v-else></ShopNavBar> -->
    </nav>
    <main style="margin-top: 100px; margin-bottom: 100px;">
        <RouterView />
    </main>
    <TopButton />
    <Footer :class="['footer', { shrink: isScrolled }]" />
</template>

<style scoped>
/* 全域樣式 */
.container {
  background-color: #ffffff;
  margin: 10px auto;
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
  background-image: none !important;
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
