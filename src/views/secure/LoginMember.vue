<template>
  <form class="aa" @submit.prevent="submitForm">
    <div class="container">
      <div class="register-box">
        <h3>會員登入</h3>

        <div class="input-group">
          <label class="jj" for="nickName">帳號</label>
          <input
            type="text"
            v-model="username"
            @keyup.enter="login"
            placeholder="e-mail"
          />
        </div>
        <span class="error">{{ message }}</span>

        <div class="input-group">
          <label for="password">密碼</label>
          <input
            type="password"
            v-model="password"
            @keyup.enter="login"
            placeholder="Password"
          />
        </div>

        <div class="gg">
          <!-- Google 登入按鈕 -->

          <!-- 普通登入按鈕 -->
          <div>
            <button type="submit" class="register-btn" :disabled="isLoggingIn">
              登入
            </button>
          </div>
        </div>
        <div class="google-login-container">
          <button class="google-login-btn" id="google-login-btn" type="button">
            <img
              src="https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
              alt="Google Icon"
              class="google-icon"
            />
            登入
          </button>
        </div>
        <div><LineLogin class="line-button-member" /></div>
        <div>
          <RouterLink class="link" to="/pages/Register">註冊會員</RouterLink>
        </div>
        <RouterLink class="nav-link" to="/secure/loginadmin">切換</RouterLink>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useUserStore from "@/stores/user.js";
import Swal from "sweetalert2";
import { axiosapi2 } from "@/plugins/axios.js";
import { loadGoogleAuth } from "@/plugins/googleAuth.js"; // 引入 Google Auth 加載函數
import LineLogin from "@/components/member/login/LineLogin.vue";

const username = ref("");
const password = ref("");
const message = ref("");
const isLoggingIn = ref(false);
const router = useRouter();
const userStore = useUserStore();

const googleClientId =
  "687382637987-mac1n2c8aakto95j4o56keqblhst1j1u.apps.googleusercontent.com";

onMounted(async () => {
  try {
    console.log("開始初始化 Google 登入...");

    // 載入新版的 Google 登入 API
    await loadGoogleAuth(googleClientId);
    console.log("Google 登入初始化成功");

    // 設定 Google 登入回應處理函數
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: googleLoginSuccess,
    });
    console.log("Google 登入回調函數已設定");

    // 渲染 Google 登入按鈕
    const googleButton = document.getElementById("google-login-btn");
    if (googleButton) {
      console.log("Google 登入按鈕渲染中...");
      window.google.accounts.id.renderButton(googleButton, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
      });
      console.log("Google 登入按鈕已成功渲染");
    } else {
      console.warn("無法找到 Google 登入按鈕元素");
    }
  } catch (error) {
    console.error("Google 登入初始化失敗:", error);
    Swal.fire({
      title: "Google 登入初始化失敗",
      icon: "error",
    });
  }
});

function googleLoginSuccess(response) {
  console.log("googleLoginSuccess", response);

  // 從 response 中提取 clientId 和 credential
  const clientId = response?.clientId || response?.client_id; // 確保提取 clientId
  const credential = response?.credential; // Google 返回的 ID Token

  // 檢查資料是否有效
  if (!clientId || !credential) {
    console.error("Google 登入資料無效，無法獲取 clientId 或 credential");
    return;
  }

  // 儲存資料到 localStorage
  localStorage.setItem("googleClientId", clientId);
  localStorage.setItem("googleCredential", credential);

  const memberData = {
    nickName: "Jude Chu",
    password: "1223",
    name: "Name",
    email: "sonicchu1223@hotmail.com",
    phone: "0932624161",
    address: "新北市板橋區",
    birthday: "2000-12-23",
  };

  // 註冊 API 請求
  axiosapi2
    .post(`/register`, memberData)
    .then((response) => {
      // 使用 SweetAlert 顯示成功註冊訊息
      Swal.fire({
        title: "登入成功！",
        icon: "success",
      });

      setTimeout(() => {
        // 註冊成功後進行自動登入
        const loginData = {
          email: memberData.email,
          password: memberData.password,
        };

        // 登入 API 請求
        axiosapi2
          .post(`/ajax/secure/login`, loginData)
          .then((loginResponse) => {
            const { token, user } = loginResponse.data;
            const { memberId, email, nickname } = user;

            // 儲存登入資訊到 localStorage
            localStorage.setItem("memberId", memberId);
            localStorage.setItem("email", email);
            localStorage.setItem("token", token);
            localStorage.setItem("nickname", nickname);
            userStore.setToken(token); // 儲存 token 到 store
            // 儲存 token 到 Pinia 的 userStore
            

            // 顯示 SweetAlert 登入成功訊息

            // 跳轉或進行其他操作
            router.push({ path: "/pages/MemberCenter" }); // 假設會員中心頁面
          })
          .catch((loginError) => {
            console.error("登入失敗", loginError);
            Swal.fire({
              title: "登入失敗",
              text: "請檢查帳號和密碼",
              icon: "error",
            });
          });
      }, 1000); // 註冊後延遲登入
    })
    .catch((registerError) => {
      console.error("註冊失敗", registerError);
      Swal.fire({
        title: "註冊失敗",
        text: "請稍後再試",
        icon: "error",
      });
    });
}


// 儲存用戶資訊到 localStorage 和 Vuex
function saveUserInfoToLocalStorage(user, token) {
  localStorage.setItem("memberId", user.memberId);
  localStorage.setItem("email", user.email);
  localStorage.setItem("token", token);
  localStorage.setItem("nickname", user.nickname);
  userStore.setToken(token);
}

// 普通登入邏輯
async function submitForm() {
  isLoggingIn.value = true; // 防止重複提交
  message.value = "";

  if (!username.value || !password.value) {
    message.value = "請填寫所有欄位";
    isLoggingIn.value = false;
    return;
  }

  const body = {
    email: username.value,
    password: password.value,
  };

  try {
    const response = await axiosapi2.post(`/ajax/secure/login`, body);
    console.log("登入成功", response);
    if (response.data.success) {
      // 使用 SweetAlert 顯示成功訊息
      await Swal.fire({
        title: response.data.message,
        icon: "success",
      });

      saveUserInfoToLocalStorage(response.data.user, response.data.token);
      axiosapi2.defaults.headers.authorization = `Bearer ${response.data.token}`;
      router.push({ path: "/pages/MemberCenter" });
    } else {
      message.value = response.data.message;
      Swal.fire({
        title: response.data.message,
        icon: "warning",
      });
    }
  } catch (error) {
    console.error("登入錯誤", error);
    Swal.fire({
      title: `登入失敗: ${error.message}`,
      icon: "error",
    });
  } finally {
    isLoggingIn.value = false; // 解除防止重複提交
  }
}
</script>

<style scoped>
.gg {
  margin-top: 35px;
  margin-bottom: 15px;
  display: flex;
  gap: 20px; /* 加一些間隔 */
  justify-content: center;
  align-items: center;
  width: 100%; /* 保證容器寬度為 100% */
}
/* 調整 Google 登入按鈕的樣式 */
.google-login-container {
  width: 220px;
  align-items: center;
  margin-left: 50px;
  margin-bottom: 10px;
}

.google-login-btn {
  font-family: "Noto Sans KR", sans-serif;
  background-color: #ffffff;
  height: 50px;
  width: 70px;
  color: #4285f4;
  border: none;
  padding: 10px px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center; /* 確保文字居中 */
  width: 100%; /* 讓按鈕寬度自適應 */
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.google-login-btn:hover {
  background-color: #dcdcdc;
  transform: scale(1.05); /* 添加放大效果 */
}

.google-icon {
  width: 60px;
  height: 20px;
  margin-right: 10px;
}

/* 強制顏色模式下的樣式調整 */
@media (forced-colors: active) {
  .google-login-btn {
    background-color: ButtonFace; /* 使用系統的背景顏色 */
    color: ButtonText; /* 使用系統的文字顏色 */
    border: 1px solid ButtonText; /* 邊框顏色使用系統文字顏色 */
    box-shadow: 0 0 5px 2px Highlight; /* 高對比度模式下的邊框陰影效果 */
  }

  .google-icon {
    width: 50px; /* 根據強制顏色模式可能需要調整圖片的顯示 */
    height: 18px; /* 同上 */
  }

  .google-login-btn:hover {
    background-color: Highlight; /* 強制顏色模式下的 hover 背景色 */
    color: HighlightText; /* 強制顏色模式下的 hover 文字顏色 */
  }
}

/* 註冊按鈕樣式 */
.register-btn {
  font-family: "Noto Sans KR", sans-serif;
  padding: 10px 30px;
  background-color: #c6bc77;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
  width: 100%; /* 設置註冊按鈕也自適應寬度 */
}

/* 防止註冊按鈕和 Google 登入按鈕的寬度不一致 */
.register-btn,
.google-login-btn {
  flex: 1; /* 確保兩個按鈕大小一致 */
}
.aa {
  margin: auto;
  padding: 20px;
  width: 300px; /* 設置表單寬度 */
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
  font-family: "Noto Sans KR", sans-serif;
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
  background-color: #fffcec;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 標題 */
.register-box h3 {
  font-family: "Noto Sans KR", sans-serif;
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
  font-family: "Noto Sans KR", sans-serif;
  display: block;
  margin-bottom: 5px;
  font-size: 20px;
  color: #555;
}

.input-group input {
  font-family: "Noto Sans KR", sans-serif;
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
  font-family: "Noto Sans KR", sans-serif;
  margin-top: 15px;
  font-size: 14px;
}

.login-link a {
  font-family: "Noto Sans KR", sans-serif;
  color: #88aa58;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
