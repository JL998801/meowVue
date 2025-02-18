<template>
  <form class="aa" @submit.prevent="submitForm">
    <div class="register-container">
      <!-- 註冊表單 -->
      <div class="register-box">
        <h2>註冊帳戶</h2>
        <div class="input-group">
          <label for="nickName">使用者暱稱</label>
          <input
            type="text"
            v-model="nickName"
            id="nickName"
            placeholder="請輸入您的使用者暱稱"
          />
        </div>

        <div class="input-group">
          <label for="email">電子郵件</label>
          <input
            type="email"
            v-model="email"
            id="email"
            placeholder="請輸入您的電子郵件"
          />
        </div>

        <div class="input-group">
          <label for="password">密碼</label>
          <input
            type="password"
            v-model="password"
            id="password"
            placeholder="請輸入您的密碼"
          />
        </div>

        <div class="input-group">
          <label for="confirm-password">確認密碼</label>
          <input
            type="password"
            v-model="confirmPassword"
            id="confirm-password"
            placeholder="請再次輸入您的密碼"
          />
        </div>

        <div class="input-group">
          <label for="name">姓名</label>
          <input
            type="text"
            v-model="name"
            id="name"
            placeholder="請輸入您的姓名"
          />
        </div>

        <div class="input-group">
          <label for="phone">手機號碼</label>
          <input
            type="text"
            v-model="phone"
            id="phone"
            placeholder="請輸入您的手機號碼"
          />
        </div>

        <div class="input-group">
          <label for="birthday">生日</label>
          <input type="date" v-model="birthday" id="birthday" />
        </div>

        <div class="input-group">
          <label for="address">地址</label>
          <input
            type="text"
            v-model="address"
            id="address"
            placeholder="請輸入您的地址"
          />
        </div>

        <div class="gg">
          <div>
            <button type="submit" class="register-btn">註冊</button>
          </div>
        </div>

        <p class="login-link">已經有帳戶？<a href="login.html">登入</a></p>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { axiosapi } from '@/plugins/axios';
import Swal from 'sweetalert2';
// Reactive state variables
const nickName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const name = ref('');
const phone = ref('');

const address = ref('');
const birthday = ref('2000-01-01');


const router = useRouter();

// Submit form function
// Submit form function
const submitForm = () => {
  // 密碼一致性驗證
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: 'error',
      title: '密碼不一致',
      text: '請確認密碼是否一致',
      confirmButtonText: '確定'
    });
    return;
  }

  // 註冊資料
  const memberData = {
    nickName: nickName.value,
    email: email.value,
    password: password.value,
    name: name.value,
    phone: phone.value,
    birthday: birthday.value,  // 日期格式
    address: address.value
  };

  // 註冊 API 請求
  axiosapi.post(`/register`, memberData)
    .then(response => {
      // 註冊成功顯示 SweetAlert2 提示
      Swal.fire({
        icon: 'success',
        title: '註冊成功!',
        text: '您的帳戶已成功創建。',
        confirmButtonText: '確定'
      });

      setTimeout(() => {
        // 註冊成功後進行自動登入
        const loginData = {
          email: email.value,
          password: password.value
        };

        // 登入 API 請求
        axiosapi.post(`/ajax/secure/login`, loginData)
          .then(loginResponse => {
            const { token, user } = loginResponse.data;
            const { memberId, email, nickname } = user;

            // 儲存登入資訊到 localStorage
            localStorage.setItem('memberId', memberId);
            localStorage.setItem('email', email);
            localStorage.setItem('token', token);
            localStorage.setItem('nickname', nickname);

            // 設置 HTTP header
            axiosapi.defaults.headers.authorization = "Bearer " + token;

            // 跳轉到會員中心
            router.push('/pages/MemberCenter');
          })
          .catch(loginError => {
            console.log("登入失敗: ", loginError);
            Swal.fire({
              icon: 'error',
              title: '登入失敗',
              text: loginError.response ? loginError.response.data.message : '未知錯誤',
              confirmButtonText: '確定'
            });
          });
      }, 1000);  // 延遲 1 秒
    })
    .catch(error => {
      console.error("錯誤詳細信息:", error);
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: '註冊失敗',
          text: error.response.data.message || '未知錯誤',
          confirmButtonText: '確定'
        });
      } else if (error.request) {
        Swal.fire({
          icon: 'error',
          title: '註冊失敗',
          text: '請求未收到回應',
          confirmButtonText: '確定'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: '註冊失敗',
          text: error.message,
          confirmButtonText: '確定'
        });
      }
    });
};
</script>

  <style scoped>

.gg {
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
  font-family: "Noto Sans KR", sans-serif;
  padding: 10px 40px;
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
  font-family: Arial, sans-serif;
}

body {
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* 註冊表單容器 */
.register-container {
  width: 100%;
  max-width: 400px;
  background-color: #fffcec;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 標題 */
.register-box h2 {
  font-family: "Noto Sans KR", sans-serif;
  margin-bottom: 0px;
  color: #655806;
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
  font-size: 14px;
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
