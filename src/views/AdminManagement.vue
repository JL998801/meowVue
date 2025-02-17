<template>
  <div class="layout">
    <!-- 🔹 左側 Sidebar (根據路徑判斷是否顯示) -->
    <sidebar v-if="!isProductPage || isSidebarOpen" />

    <!-- 🔹 當 Sidebar 隱藏時，顯示展開按鈕 -->
    <button v-if="isProductPage && !isSidebarOpen" class="sidebar-toggle" @click="toggleSidebar">
      ☰
    </button>

    <!-- 🔹 右側內容區域 (根據選單變換) -->
    <div class="main-content" :class="{ 'full-width': isProductPage && !isSidebarOpen }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import sidebar from "@/components/admin/sidebar.vue";
import { ref, computed} from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isCaseMenuOpen = ref(false); // 控制案件管理子選單的開關

const toggleCaseMenu = () => {
  isCaseMenuOpen.value = !isCaseMenuOpen.value; // 切換開關狀態
};

const isSidebarOpen = ref(false); // 控制 Sidebar 是否展開

// 計算屬性：判斷當前路徑是否為 `/admin/products`
const isProductPage = computed(() => route.path.startsWith("/admin/products"));

// 切換 Sidebar 顯示
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<style scoped>
/* 🔹 保持 Sidebar 固定，讓內容區域變動 */
.layout {
  display: flex;
  height: 100vh;
}

.main-content {
  flex-grow: 1;
  margin-left: 240px; /* Sidebar 寬度一致 */
  padding: 20px;
}

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

/* 🔹 當 Sidebar 隱藏時，內容區全屏 */
.full-width {
  margin-left: 0;
}

/* 🔹 隱藏 Sidebar 時顯示按鈕 */
.sidebar-toggle {
  position: fixed;
  top: 20px;
  left: 10px;
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 5px;
  z-index: 1000;
}

.sidebar-toggle:hover {
  background-color: #555;
}
</style>