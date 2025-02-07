<template>
  <div id="shop-layout">
    <!-- 商城導覽列 -->
    <nav>
      <ShopNavBar />
    </nav>
    
    <!-- 商城的主要內容 -->
    <main>
      <router-view /> 
      <!-- ✅ 載入 `ShopHome.vue` 或其他商城頁面 -->
    </main>

    <!-- 側邊攔:購物車 -->
    <aside>
      <div class="cart-icon" @click="toggleDropdown">
        <font-awesome-icon :icon="['fas', 'shopping-cart']" />
        <span class="cart-count">{{ cartCount }}</span>
      </div>

      <!-- ✅ 購物車彈出視窗 -->
      <CartDropdown :isOpen="isDropdownOpen" />
    </aside>

    <!-- 商城專用 Footer -->
    <footer>
      <p>© 2024 壁爐之家商城. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, computed, watchEffect } from "vue";
import useUserStore from "@/stores/user";
import ShopNavBar from '@/components/ShopNavBar.vue';

const userStore = useUserStore();
const isLogin = computed(() => userStore.isLogin);

// ✅ 頁面載入時檢查登入狀態
onMounted(() => {
  isLogin.value = !!localStorage.getItem("memberId");
  loadCartCount;
});

// ✅ 監聽 localStorage 變更，確保狀態同步
watchEffect(() => {
  isLogin.value = !!localStorage.getItem("authToken");
});

</script>

<style scoped>
#shop-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex-grow: 1;
  padding: 20px;
}

.cart-icon {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.cart-count {
  background: red;
  color: white;
  font-size: 12px;
  border-radius: 50%;
  padding: 2px 6px;
  position: absolute;
  top: -5px;
  right: -5px;
}

footer {
  background: #f8f9fa;
  text-align: center;
  padding: 10px;
  margin-top: 20px;
}
</style>
