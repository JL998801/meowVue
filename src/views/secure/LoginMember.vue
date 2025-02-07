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
                <td><input type="text" v-model="password" @keyup.enter="login"></td>
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

	<div>
		<RouterLink class="link" to="/pages/Register">註冊會員</RouterLink>
	</div>
	
</template>
<script setup>
import xxx from '@/plugins/axios.js';
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useUserStore from '@/stores/user.js';

const username=ref("")
const password=ref("")
const message=ref("")
const router=useRouter()
const userStore = useUserStore();

async function login() {
    document.querySelector(".error").innerHTML = "";
    message.value = "";
    if (username.value == "") {
        username.value = null;
    }
    if (password.value == "") {
        password.value = null;
    }
    const body = {
        "email": username.value,
        "password": password.value,
    };
    
    // 清空之前的 header 授權信息
    xxx.defaults.headers.authorization = "";
    userStore.setEmail("");

    try {
        const response = await xxx.post("/ajax/secure/login", body);
        console.log("response",  response.data);
        
        if (response.data.success) {
            // 登入成功後顯示訊息
            await Swal.fire({
                title: response.data.message,
                icon: "success"
            });

            // 儲存登入資訊到 localStorage，將資料轉換成字串格式
            localStorage.setItem("memberId", response.data.user.memberId);  // 儲存 `memberId`
            localStorage.setItem("email", response.data.user.email);        // 儲存 `email`
            localStorage.setItem("token", response.data.token);             // 儲存 JWT Token
            localStorage.setItem("nickname", response.data.user.nickname);  // 儲存 `nickname`

            // 設定 authorization header
            xxx.defaults.headers.authorization = "Bearer " + response.data.token;
            
            // 儲存使用者資訊到狀態管理 (如果有)
            userStore.setEmail(response.data.user);

            // 跳轉到會員中心
            router.push({ path: "/pages/MemberCenter" });
        } else {
            // 登入失敗，顯示錯誤訊息
            document.querySelector(".error").innerHTML = response.data.message;
            Swal.fire({
                title: response.data.message,
                icon: "warning"
            });
        }
    } catch (error) {
        console.log("error", error);
        // 捕獲錯誤並顯示
        Swal.fire({
            title: "執行失敗:" + error.message,
            icon: "error"
        });
    }
}


</script>