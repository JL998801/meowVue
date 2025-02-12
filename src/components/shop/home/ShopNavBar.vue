<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import useUserStore from "@/stores/user";
import Swal from "sweetalert2";
import {storeToRefs} from "pinia";
import useCartStore from "@/stores/cartStore";
import useWishListStore from "@/stores/wishlistStore";
import useNotificationStore from "@/stores/wishlistStore";
import BadgeCounter from "../home/BadgeCounter.vue";
import petLogo from "@/assets/petLogo.png"; // Logo 圖示

// ✅ 接收來自 `ShopLayout.vue` 的 `props`
const props = defineProps({
  isUserLoggedIn: Boolean,
  cartCount: Number,       // 購物車數量
  wishlistCount: Number,   // 願望清單數量
  notificationCount: Number, // 通知數量
});

// 初始化: Store、空陣列
const userStore = useUserStore();
const router = useRouter();
const cartStore = useCartStore();
const wishListStore = useWishListStore();
const notificationStore = useNotificationStore();

// ✅ 確保 cartCount 是響應式的，當購物車內容變更時，Vue 會自動更新 BadgeCounter 的 count
const { cartCount, wishlistCount, notificationCount} = storeToRefs(cartStore,wishListStore,notificationStore);

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

// ✅ 手動開啟 Modal
const openModal = (modalId) => {
  const modal = new bootstrap.Modal(document.querySelector(modalId));
  modal.show();
};
</script>

<template>
  <div>
  <!-- 管理登入後導覽列的 badge標籤 => modal彈窗 -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
          <RouterLink class="navbar-brand" aria-current="page" to="/">
            <img :src="petLogo" alt="Logo圖示" width="80" title="首頁">壁爐之家</RouterLink>

        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
              <RouterLink class="navbar-brand" aria-current="page" to="/shop">商城首頁</RouterLink>
          </li>
          <!-- updateOnClick="true" 點擊即時更新 -->
          <!-- 不使用 data-bs-toggle="modal"，Vue 不會讓 Bootstrap 自動打開 modal。 -->
          <!-- 當點擊 BadgeCounter，它會觸發 toggle()，並透過 @open-modal="openModal" 讓 ShopNavBar.vue 手動開啟 modal -->
          <li class="nav-item">
            <BadgeCounter
              icon="🛒"
              :count="cartCount"
              modalTarget="#cartModal"
              :updateOnClick="true"  
              @open-modal="openModal"
            />
          </li>

          <li class="nav-item">
            <BadgeCounter
              icon="❤️"
              :count="wishlistCount"
              modalTarget="#wishListModal"
              :updateOnClick="true"
              @open-modal="openModal"
            />
          </li>

          <li class="nav-item">
            <BadgeCounter
              icon="🔔"
              :count="notificationCount"
              modalTarget="#notificationModal"
              :updateOnClick="true"
              @open-modal="openModal"
            />
          </li>

          <!-- 🔹 登出 -->
          <li class="nav-item">
            <button class="btn btn-danger" @click="handleLogout">登出</button>
          </li>
          <li class="nav-item">
              <RouterLink class="btn btn-danger" to="/secure/login">登入</RouterLink>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
