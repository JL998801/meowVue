<script setup>
import { defineProps } from "vue";
import { useRouter } from "vue-router";
import useUserStore from "../../../stores/user";
import Swal from "sweetalert2";

const props = defineProps({
  isLogin: Boolean,        // 是否登入
});

const userStore = useUserStore();
const router = useRouter();

</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <RouterLink class="navbar-brand" aria-current="page" to="/">
            <img src="../assets/petLogo.png" alt="Logo圖示" width="80" title="首頁">壁爐之家</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <RouterLink class="navbar-brand" aria-current="page" to="/shop">商城首頁</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="btn btn-danger" to="/secure/login">🚪 登入</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

