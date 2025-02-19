<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" aria-current="page" to="/">
        <img
          src="../assets/petLogo.png"
          alt="Logo圖示"
          width="80"
          title="首頁" /><span class="site-title"
          ><img src="@/assets/logowords.png" /></span
      ></RouterLink>
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
        <ul class="navbar-nav ms-auto nav-links">
          <li class="nav-item dropdown" title="浪浪案件">
            <span
              class="nav-link dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              浪浪案件</span
            >
            <ul class="dropdown-menu">
              <li>
                <RouterLink class="dropdown-item" to="/pet/rescue/search"
                  >流浪救援</RouterLink
                >
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/pages/Adopt"
                  >動物認養</RouterLink
                >
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/pet/lost/search"
                  >遺失協尋</RouterLink
                >
              </li>
            </ul>
          </li>
          <li class="nav-item" title="寵物商城">
            <RouterLink class="nav-link active" aria-current="page" to="/shop"
              >寵物商城</RouterLink
            >
          </li>
          <li class="nav-item" title="救援活動">
            <RouterLink
              class="nav-link active"
              aria-current="page"
              to="/pets/products"
              >救援活動</RouterLink
            >
          </li>
          <li class="nav-item" title="地圖">
            <RouterLink
              class="nav-link active"
              aria-current="page"
              to="/pet/map"
              >案件地圖
              <font-awesome-icon
                :icon="['fas', 'map-location-dot']"
                size="xl"
                style="color: #c4bc7f"
            /></RouterLink>
          </li>
          <li class="nav-item">
            <!--- 根據是否已登入顯示不同的 RouterLink -->
            <RouterLink
              v-if="isLoggedIn"
              class="nav-link"
              to="/pages/MemberCenter"
              >會員中心</RouterLink
            >
            <RouterLink v-else class="nav-link" to="/secure/login"
              >會員登入</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import useUserStore from "@/stores/user.js";

//使用 Pinia 的 userStore "Pinia": Unknown word.
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLogin); //直接從 Store 獲取
</script>

<style scoped>
.site-title img {
  margin-left: 0;
  width: 200px;
  color: #333 !important; /* 文字顏色 */
}

.nav-links .nav-item {
  font-size: 1.1rem; /* 增大字體 */
  font-weight: 600;
  margin-right: 20px; /* 增加與右邊的距離 */
  color: #333 !important; /* 文字顏色 */
}
</style>
