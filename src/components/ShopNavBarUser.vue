<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import useUserStore from "../stores/user";
import Swal from "sweetalert2";

const props = defineProps({
  cartCount: Number,
  wishlistCount: Number,
  notificationCount: Number
});

const userStore = useUserStore();
const router = useRouter();

// ✅ 登出確認
const handleLogout = async () => {
  const result = await Swal.fire({
    title: "登出確認",
    text: "您確定要登出嗎？",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "確定",
    cancelButtonText: "取消",
  });

  if (result.isConfirmed) {
    userStore.logout();
    router.push("/shop"); // ✅ 登出後回到商城首頁
  }
};
</script>

<template>
    <!-- 管理登入後導覽列的 badge標籤 & modal彈窗 -->
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <RouterLink class="navbar-brand" aria-current="page" to="/">
            <img src="../assets/petLogo.png" alt="Logo圖示" width="80" title="首頁">壁爐之家</RouterLink>

      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
            <RouterLink class="navbar-brand" aria-current="page" to="/shop">商城首頁</RouterLink>
        </li>
        <!-- 🔹 願望清單 -->
        <li class="nav-item">
          <button class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#wishlistModal">
            💖 願望清單 <span v-if="props.wishlistCount" class="badge bg-danger">{{ props.wishlistCount }}</span>
          </button>
        </li>

        <!-- 🔹 購物車 -->
        <li class="nav-item">
          <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#cartModal">
            🛒 購物車 <span v-if="props.cartCount" class="badge bg-warning">{{ props.cartCount }}</span>
          </button>
        </li>

        <!-- 🔹 訊息通知 -->
        <li class="nav-item">
          <button class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#notificationModal">
            🔔 訊息通知 <span v-if="props.notificationCount" class="badge bg-info">{{ props.notificationCount }}</span>
          </button>
        </li>

        <!-- 🔹 登出 -->
        <li class="nav-item">
          <button class="btn btn-danger" @click="handleLogout">🚪 登出</button>
        </li>
      </ul>
    </div>
  </nav>

  <!-- 🔹 Modal - 願望清單 -->
  <div class="modal fade" id="wishlistModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">願望清單</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <WishList />
        </div>
      </div>
    </div>
  </div>

  <!-- 🔹 Modal - 購物車 -->
  <div class="modal fade" id="cartModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">購物車</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <SmallCart />
        </div>
      </div>
    </div>
  </div>

  <!-- 🔹 Modal - 訊息通知 -->
  <div class="modal fade" id="notificationModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">通知中心</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <Notifications />
        </div>
      </div>
    </div>
  </div>
</template>
