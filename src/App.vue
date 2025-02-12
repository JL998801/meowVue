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
