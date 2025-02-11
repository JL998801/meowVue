<template>    
	<form class="aa" @submit.prevent="submitForm">
        
		<div class="container">
		  <!-- 註冊表單 -->
		  <div class="register-box">
			<h3>管理員</h3>
			<div class="input-group">
			  <label for="nickName">使用者暱稱</label>
			  <input type="text" v-model="username" @keyup.enter="login">
			</div>
			<span class="error">{{ message }}</span>
			<div class="input-group">
			  <label for="password">密碼</label>
			  <input type="text" v-model="password" @keyup.enter="login">
			</div>
	
			<div class="gg">

				<button type="button" class="register-btn" @click="login">
          登入
        </button>
			</div>
	
			<RouterLink class="nav-link" to="/secure/login">切換</RouterLink>
		  </div>
		</div>
	  </form>
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
    "username": username.value,
    "password": password.value,
  };

  xxx.defaults.headers.authorization = "";

  try {
    const response = await xxx.post("/secure/loginadmin", body);
    console.log("response", response);

    if (response.data.success) {
      // 存儲 token 到 localStorage
      saveUserInfoToLocalStorage(response.data.token);
      userStore.setToken(response.data.token);

      await Swal.fire({
        title: response.data.message,
        icon: "success"
      });
      xxx.defaults.headers.authorization = "Bearer " + response.data.token;

      router.push({ path: "/admin" });
    } else {
      document.querySelector(".error").innerHTML = response.data.message;
      Swal.fire({
        title: response.data.message,
        icon: "warning"
      });
    }
  } catch (error) {
    console.log("error", error);
    Swal.fire({
      title: "執行失敗:" + error.message,
      icon: "error"
    });
  }
}

// 保存 token 到 localStorage 的函數
function saveUserInfoToLocalStorage(token) {
  localStorage.setItem("authToken", token); // 儲存 token
  console.log("Token saved to localStorage:", token);
}

</script>


<style scoped>

.gg {
    margin-top: 35px;
    display: flex;
    gap: 20px; /* 加一些間隔 */
    justify-content: center;
    align-items: center;
    width: 100%; /* 保證容器寬度為 100% */
}
 /* 調整 Google 登入按鈕的樣式 */
.google-login-container {
    flex: 1; /* 確保按鈕的寬度相等 */
}

.google-login-btn {
  font-family: 'Noto Sans KR', sans-serif;
    background-color: #f0f0f0;
    color: #4285F4;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    width: 100%; /* 讓按鈕寬度自適應 */
}

.google-login-btn:hover {
    background-color: #dcdcdc;
}

.google-icon {
    width: 60px;
    height: 20px;
    margin-right: 10px;
}

/* 註冊按鈕樣式 */
.register-btn {
    font-family: 'Noto Sans KR', sans-serif;
    padding: 10px 1px ;
    background-color: #C6BC77 ;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
    width: 100%; /* 設置註冊按鈕也自適應寬度 */
}

/* 防止註冊按鈕和 Google 登入按鈕的寬度不一致 */
.register-btn, .google-login-btn {
    flex: 1; /* 確保兩個按鈕大小一致 */
}
.aa {
  margin: auto;
  padding: 20px;
  width: 300px;  /* 設置表單寬度 */
  width: 100%;
    max-width: 400px;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    
}

 /* 全局樣式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
	font-family: 'Noto Sans KR', sans-serif;
}

body {
  
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

/* 註冊表單容器 */
.container {
  
    width: 100%;
    max-width: 400px;
    background-color: #FFFCEC ;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

/* 標題 */
.register-box h3 {
  font-family: 'Noto Sans KR', sans-serif;
    margin-bottom: 0px;
    color: #655806;
	margin-bottom: 10px;
}

/* 輸入框 */
.input-group {
  
    text-align: left;
    margin-bottom: 15px;
}

.input-group label {
  font-family: 'Noto Sans KR', sans-serif;
    display: block;
    margin-bottom: 5px;
    font-size: 20px;
    color: #555;
}

.input-group input {
  font-family: 'Noto Sans KR', sans-serif;
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}



.register-btn:hover {
    background-color: #6b500d;
}

/* 登入連結 */
.login-link {
  font-family: 'Noto Sans KR', sans-serif;
    margin-top: 15px;
    font-size: 14px;
}

.login-link a {
  font-family: 'Noto Sans KR', sans-serif;
    color: #88aa58;
    text-decoration: none;
}

.login-link a:hover {
    text-decoration: underline;
}

  </style>
  
