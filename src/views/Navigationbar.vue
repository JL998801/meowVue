<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" aria-current="page" to="/">Logo</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item dropdown">
                        <span class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">通報案件</span>
                        <ul class="dropdown-menu">
                            <li>
                                <RouterLink class="dropdown-item" to="/pages/products">流浪救援</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" to="/pages/products">動物認養</RouterLink>
                            </li>
                            <li>
                                <RouterLink class="dropdown-item" to="/pages/products">遺失協尋</RouterLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link active" aria-current="page" to="/pages/products">寵物商城</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link active" aria-current="page" to="/pages/products">救援活動</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link active" aria-current="page" to="/pages/products">地圖</RouterLink>
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