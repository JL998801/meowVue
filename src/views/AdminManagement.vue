<template>
  <div class="layout">
    <!-- 🔹 左側 Sidebar (固定) -->
    <sidebar />

    <!-- 🔹 右側內容區域 (根據選單變換) -->
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import sidebar from "@/components/admin/sidebar.vue";
import { ref } from "vue";


const isCaseMenuOpen = ref(false); // 控制案件管理子選單的開關

const toggleCaseMenu = () => {
  isCaseMenuOpen.value = !isCaseMenuOpen.value; // 切換開關狀態
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



</style>