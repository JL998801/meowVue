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
import xxx from "@/plugins/axios.js";
import Swal from "sweetalert2";
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

.sidebar {
  width: 240px;
  background-color: #0d2741;
  color: #fff;
  position: fixed;
  height: 100%;
  margin: 0;
  padding: 20px 10px;
}

.sidebar h2 {
  font-size: 20px;
  margin-bottom: 20px;
}

.sidebar a {
  display: block;
  color: #fff;
  text-decoration: none;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
}

.sidebar a:hover {
  background-color: #1a456a;
}

.main-content {
  margin-left: 240px;
  padding: 20px;
}

.main-content .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header .title {
  font-size: 24px;
  font-weight: bold;
}

.header .member-info {
  font-size: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

th {
  background-color: #f8f8f8;
}

.pagination {
  margin: 20px 0;
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
}

.pagination li {
  margin: 0 5px;
}

.pagination a {
  text-decoration: none;
  color: #007bff;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pagination a:hover {
  background-color: #007bff;
  color: #fff;
}

/* 🔹 案件管理的子選單樣式 */
.submenu {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  background-color: #007bff;
}

.submenu a {
  display: block;
  padding: 5px 10px;
  text-decoration: none;
  color: #ffffff;
  /* background-color: #1a456a; */
  margin: 2px 0;
  border-radius: 4px;
}

.submenu a:hover {
  background-color: #0d2741;
}
</style>
