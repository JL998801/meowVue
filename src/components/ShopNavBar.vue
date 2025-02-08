<template>
    <!-- ✅ 未登入時顯示 -->
    <template v-if="!isLogin" class="shop-nav">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#"><RouterLink class="navbar-brand" aria-current="page" to="/">
            <img src="../assets/petLogo.png" alt="Logo圖示" width="80" title="首頁">壁爐之家</RouterLink></a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item" title="商城首頁">
                    <RouterLink class="nav-link active" aria-current="page" to="/shop">商城首頁</RouterLink>
                </li>
                <!-- ✅ 未登入時顯示登入按鈕 -->
                <li v-if="!isLogin">
                    <router-link to="/secure/login">登入</router-link>
                </li>
            </ul>
            </div>
        </nav>
    </template>

    <!-- ✅ 已登入時顯示 -->
    <template v-else>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <a class="navbar-brand" href="#"><RouterLink class="navbar-brand" aria-current="page" to="/">
            <img src="../assets/petLogo.png" alt="Logo圖示" width="80" title="首頁">壁爐之家</RouterLink></a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item" title="商城首頁">
                        <RouterLink class="nav-link active" aria-current="page" to="/shop">商城首頁</RouterLink>
                    </li>
                    
                    <!-- 加入小組件:購物車、願望清單、通知 -->
                    <smallCart />
                    <WishList />
                    <Notifications />
                    <li class="nav-item" title="登出">
                        <!-- ✅ 只有登入後才顯示登出按鈕 -->
                        <li v-if="userStore.isLogin" class="nav-item" title="登出">
                            <button @click="handleLogout">登出</button>
                        </li>
                    </li>
                </ul>
            </div>
        </nav>
    </template>
</template>

<script setup>
import { computed } from "vue";
import useUserStore from "../stores/user";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import WishList from '../components/WishList.vue'; // 願望清單
import Notifications from '../components/Notifications.vue'; //通知小鈴鐺
import smallCart from '../components/SmallCart.vue'; // 購物車

const userStore = useUserStore();
const isLogin = computed(() => userStore.isLogin);;

// ✅ 登出後導向 `/shop`
const handleLogout = () => {
  userStore.logout(); // 執行登出
  router.push("/shop"); // 重新導向商城首頁
};

</script>

<style scoped>
.navbar {
display: flex;
justify-content: space-between;
align-items: center;
background-color: #f8f9fa;
padding: 15px;
}

.nav-links a {
margin: 0 10px;
}

button {
background: none;
border: none;
cursor: pointer;
color: #c6bc77;
}
</style>
