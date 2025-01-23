<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" aria-current="page" to="/"
        ><img src="../assets/logo.png" alt="logo" style="width: 5%"
      /></RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <span
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              >通報案件</span
            >
            <ul class="dropdown-menu">
              <li>
                <RouterLink class="dropdown-item" to="/pet/rescue">流浪救援</RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/pages/products"
                  >動物認養</RouterLink
                >
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/pages/products"
                  >遺失協尋</RouterLink
                >
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link active" aria-current="page" to="/pages/products"
              >寵物商城</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link active" aria-current="page" to="/pages/products"
              >救援活動</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link active" aria-current="page" to="/pages/products"
              >地圖</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link active" aria-current="page" to="/pages/products"
              >地圖</RouterLink
            >
          </li>
          <li class="nav-item">
            <!-- 根據是否已登入顯示不同的 RouterLink -->
            <RouterLink v-if="isLoggedIn" class="nav-link" to="/member-center">會員中心</RouterLink>
            <RouterLink v-else class="nav-link" to="/secure/login"> 會員登入 </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import useUserStore from "@/stores/user.js";
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn); // 直接從 Store 獲取

import { computed } from "vue";

function getToken() {
    return localStorage.getItem("token"); // 假設你的 JWT Token 存在 localStorage
}

const isLoggedIn = computed(() => {
    const token = getToken();
    if (!token) return false;

    try {
        // 簡單驗證 JWT 的有效性（例如是否過期）
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime; // Token 是否未過期
    } catch (error) {
        return false; // 如果解析出錯，認為未登入
    }
});




</script>

<style></style>
