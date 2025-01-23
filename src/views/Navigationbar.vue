<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" aria-current="page" to="/">
            <img src="../images/petLogo.png" alt="Logo圖示" width="80" title="首頁">壁爐之家</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item dropdown" title="通報案件">
                        <span class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <font-awesome-icon :icon="['fas', 'paw']" size="2xl" style="color: #c4bc7f;" /></span>
                        <ul class="dropdown-menu">
                            <li>
                                <RouterLink class="dropdown-item" to="/pages/products">流浪救援</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" to="/adopt">動物認養</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" to="/pages/products">遺失協尋</RouterLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item" title="寵物商城">
                        <RouterLink class="nav-link active" aria-current="page" to="/pages/products">
                            <font-awesome-icon :icon="['fas', 'gifts']" size="2xl" style="color: #c4bc7f;" /></RouterLink>
                    </li>
                    <li class="nav-item" title="救援活動">
                        <RouterLink class="nav-link active" aria-current="page" to="/pages/products">
                            <font-awesome-icon :icon="['fas', 'hand-holding-heart']" size="2xl" style="color: #c4bc7f;"/></RouterLink>
                    </li>
                    <li class="nav-item" title="地圖">
                        <RouterLink class="nav-link active" aria-current="page" to="/pages/products">
                            <font-awesome-icon :icon="['fas', 'map-location-dot']" size="2xl" style="color: #c4bc7f;" /></RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/secure/login">登入/註冊</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import useUserStore from "@/stores/user.js";
const userStore = useUserStore();
</script>
    
<style>

</style>
