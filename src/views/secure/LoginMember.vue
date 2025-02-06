<template>
    <h3>Login</h3>
    <table>
        <tbody>
            <tr>
                <td>ID : </td>
                <td><input type="text" v-model="username" @keyup.enter="login"></td>
                <td><span class="error">{{ message }}</span></td>
            </tr>
            <tr>
                <td>PWD : </td>
                <td><input type="password" v-model="password" @keyup.enter="login"></td>
                <td></td>
            </tr>
            <tr>
                <td> </td>
                <td align="right"><button type="button" @click="login">login</button></td>
            </tr>
            <tr>
                <RouterLink class="nav-link" to="/secure/loginadmin">(切換管理員)</RouterLink>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import axios from '@/plugins/axios.js';
import Swal from 'sweetalert2';
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';

// 綁定使用者輸入的帳號與密碼
const username = ref("");
const password = ref("");
const message = ref("");
const router = useRouter(); // 頁面挑轉
const route = useRoute(); // 取得路由參數
const isShopRoute = computed(() => route.path.startsWith("/shop"));  // 判斷是否從商城路徑進入

const login = async () => {
    try {
        const response = await axios.post('/ajax/secure/login', {
            username: username.value,
            password: password.value
        });

        if (response.data.success) {
            // ✅ 儲存 Token 到 localStorage
            localStorage.setItem("authToken", response.data.token);
            
            // ✅ 更新全域 isLoggedIn 狀態
            isLoggedIn.value = true;

            // ✅ 顯示成功提示
            Swal.fire({
                icon: 'success',
                title: '登入成功',
                text: '即將跳轉至首頁',
                timer: 1500,
                showConfirmButton: false
            });

            // ✅ 跳轉到首頁
            setTimeout(() => {
                router.push('/');
            }, 1500);
        } else if(!isShopRoute) {
            // ✅ 儲存 Token 到 localStorage
            localStorage.setItem("authToken", response.data.token);
            
            // ✅ 更新全域 isLoggedIn 狀態
            isLoggedIn.value = true;

            // ✅ 顯示成功提示
            Swal.fire({
                icon: 'success',
                title: '登入成功',
                text: '即將跳轉至首頁',
                timer: 1500,
                showConfirmButton: false
            });

            // ✅ 跳轉到首頁
            setTimeout(() => {
                router.push('/shop');
            }, 1500);
        }else{
            message.value = "帳號或密碼錯誤";
        }
    } catch (error) {
        console.error("登入失敗:", error);
        message.value = "登入失敗，請稍後再試";
    }
};
</script>