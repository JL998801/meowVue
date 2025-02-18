<template>
  <div class="back-sidebar">
    <h2>後台管理系统</h2>
    <router-link to="/admin/adminCard">用戶管理</router-link>
    <router-link to="/admin/categories">分類管理</router-link>
    <router-link to="/admin/orders">訂單管理</router-link>
    <router-link to="/admin/products">商品管理</router-link>

    <div class="submenu-container">
      <div class="menu-title" @click="toggleCaseManage">寵物案件管理 ⮟</div>
      <div v-show="isCaseMenuOpen1" class="submenu">
        <router-link to="/admin/rescueCase">救援案件</router-link>
        <router-link to="/admin/adopt-case">認養案件</router-link>
        <router-link to="/admin/lostCase">遺失案件</router-link>
      </div>
    </div>
    <div class="submenu-container">
      <div class="menu-title" @click="toggleCaseAnalysis">寵物案件分析 ⮟</div>
      <div v-show="isCaseMenuOpen2" class="submenu">
        <router-link to="/admin/rescueAnalysis">救援案件</router-link>
        <router-link to="/admin/adopt-case">認養案件</router-link>
        <router-link to="/admin/lostCase">遺失案件</router-link>
      </div>
    </div>
    <router-link to="/admin/operations">運營管理</router-link>
  </div>
</template>

<script setup>
import { ref } from "vue";

//寵物案件管理
const toggleCaseManage = () => {
  isCaseMenuOpen1.value = !isCaseMenuOpen1.value;
};
const isCaseMenuOpen1 = ref(false); // 控制寵物案件管理子選單的開關

//寵物案件分析
const toggleCaseAnalysis = () => {
  isCaseMenuOpen2.value = !isCaseMenuOpen2.value;
};
const isCaseMenuOpen2 = ref(false); // 控制寵物案件分析子選單的開關
</script>

<style scoped>
/* 🔹 Sidebar 樣式 */
.back-sidebar {
  width: 220px;
  background-color: #0d2741;
  color: #fff;
  padding: 20px 10px;
  height: 100vh;
  position: fixed;
}

.back-sidebar h2 {
  font-size: 20px;
  margin-bottom: 20px;
}

.menu-title {
  display: block;
  color: #fff;
  text-decoration: none;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
}
.menu-title:hover {
  background-color: #1a456a;
}

.back-sidebar a {
  display: block;
  color: #fff;
  text-decoration: none;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
}

.back-sidebar a:hover {
  background-color: #1a456a;
}

/* 🔹 子選單樣式 */
.submenu-container {
  margin-top: 10px;
}

.submenu {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  background-color: #1a456a;
}
</style>
