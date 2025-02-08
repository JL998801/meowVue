<template>
  <div id="shop-layout">
    <!-- 商城導覽列 -->
    <nav>
      <ShopNavBar />
    </nav>

    <div class="shop-container">
      <!-- 左側:搜尋條件列表 -->
      <aside>
        <ShopSearch/>
      </aside>
    
      <!-- 右側: 商城的主要內容 -->
      <main class="shop-content">
        <router-view /> 
        <!-- ✅ 載入 `ShopHome.vue` 或其他商城頁面 -->
      </main>
    </div>
    
    <!-- 商城專用 Footer -->
    <footer>
      <p>© 2024 壁爐之家商城. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref,onMounted } from "vue";
import useUserStore from "@/stores/user";
import ShopNavBar from '@/components/ShopNavBar.vue';
import ShopSearch from '@/components/ShopSearch.vue';

// ✅ 判斷是否登入；user.js有加入watchEffect()`token` & `isLogin` 會自動同步
const userStore = useUserStore();

// ✅ 頁面載入時檢查登入狀態
onMounted(() => {
  userStore.token = ref(localStorage.getItem("token") || "");
});

</script>

<style scoped>
.shop-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.shop-container {
  display: flex;
  flex: 1;
}

.shop-search {
  width: 250px;
  padding: 15px;
  background: #f8f9fa;
  border-right: 1px solid #ddd;
}

.shop-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
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
