<template>
  <form class="aa" @submit.prevent="submitForm">
    <div class="container">
      <!-- 註冊表單 -->
      <div class="register-box">
        <h2>註冊帳戶</h2>
        <div class="input-group">
          <label for="nickName">使用者暱稱</label>
          <input type="text" v-model="nickName" id="nickName" placeholder="請輸入您的使用者暱稱">
        </div>

        <div class="input-group">
          <label for="email">電子郵件</label>
          <input type="email" v-model="email" id="email" placeholder="請輸入您的電子郵件">
        </div>

        <div class="input-group">
          <label for="password">密碼</label>
          <input type="password" v-model="password" id="password" placeholder="請輸入您的密碼">
        </div>

        <div class="input-group">
          <label for="confirm-password">確認密碼</label>
          <input type="password" v-model="confirmPassword" id="confirm-password" placeholder="請再次輸入您的密碼">
        </div>

        <div class="input-group">
          <label for="name">姓名</label>
          <input type="text" v-model="name" id="name" placeholder="請輸入您的姓名">
        </div>

        <div class="input-group">
          <label for="phone">手機號碼</label>
          <input type="text" v-model="phone" id="phone" placeholder="請輸入您的手機號碼">
        </div>

        <div class="input-group">
          <label for="birthday">生日</label>
          <input type="date" v-model="birthday" id="birthday">
        </div>

        <div class="input-group">
          <label for="address">地址</label>
          <input type="text" v-model="address" id="address" placeholder="請輸入您的地址">
        </div>

        <div class="gg">
          <div class="google-login-container">
            <button class="google-login-btn">
              <img src="https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" alt="Google Icon" class="google-icon">
              登入 
            </button>
          </div>
          <div>
            <button type="submit" class="register-btn">註冊</button>
          </div>
        </div>

        <p class="login-link">已經有帳戶？<a href="login.html">登入</a></p>
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();

    // 使用 ref 或 reactive 來管理狀態
    const memberId = ref(null);
    const nickName = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const name = ref('');
    const phone = ref('');
    const birthday = ref('');
    const address = ref('');

   // 註冊表單提交函數
const submitForm = () => {
  // 驗證密碼是否一致
  if (password.value !== confirmPassword.value) {
    alert("密碼不一致！");
    return;
  }

  // 註冊的資料
  const memberData = {
    nickName: nickName.value,
    email: email.value,
    password: password.value,
    name: name.value,
    phone: phone.value,
    birthday: birthday.value,  // 使用字串格式的日期
    address: address.value
  };

  // 註冊 API 請求
  axios.post('http://localhost:8080/api/register', memberData)
    .then(response => {
      alert('註冊成功！');

      // 模擬延遲，讓資料庫有時間處理註冊資料
      setTimeout(() => {
        // 註冊成功後自動呼叫登入 API
        const loginData = {
          email: email.value,
          password: password.value
        };

        // 登入 API 請求
        axios.post('http://localhost:8080/ajax/secure/login', loginData)
          .then(loginResponse => {
            console.log('Login response:', loginResponse.data);  // 调试打印返回数据
            const { token, user } = loginResponse.data;

            const { memberId, email, nickname } = user;
            // 儲存登入資訊到 localStorage
            localStorage.setItem('memberId', memberId); // 儲存 `memberId`
            localStorage.setItem('email', email); // 儲存 `email`
            localStorage.setItem('token', token); // 儲存 JWT Token
            localStorage.setItem("nickname", nickname); // 儲存 `nickname`

            // 設定 authorization header
            axios.defaults.headers.authorization = "Bearer " + token;

            // 跳轉到會員中心
            router.push('/pages/MemberCenter');
          })
          .catch(loginError => {
            console.log("登入失敗: loginError", loginError);
            alert('登入失敗: ' + (loginError.response ? loginError.response.data.message : '未知錯誤'));
          });
      }, 1000);  // 延遲 1 秒
    })
    .catch(error => {
      // 打印完整的錯誤對象，以便調試
      console.error("錯誤詳細信息:", error);

      // 如果錯誤有 response 屬性（例如 HTTP 請求錯誤）
      if (error.response) {
        // 打印 HTTP 狀態碼
        console.error("HTTP 狀態碼:", error.response.status);

        // 打印錯誤信息
        console.error("錯誤訊息:", error.response.data.message || error.response.data);

        // 顯示錯誤訊息給用戶
        alert('註冊失敗: ' + (error.response.data.message || '未知錯誤'));
      } else if (error.request) {
        // 如果請求發送出去但沒有收到回應
        console.error("請求沒有收到回應:", error.request);
        alert('註冊失敗: 請求未收到回應');
      } else {
        // 其他錯誤（例如在設置請求過程中發生錯誤）
        console.error("發生錯誤:", error.message);
        alert('註冊失敗: ' + error.message);
      }
    });
};

    // 返回需要在模板中使用的資料和方法
    return {
      memberId,
      nickName,
      email,
      password,
      confirmPassword,
      name,
      phone,
      birthday,
      address,
      submitForm
    };
  }
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
    font-family: 'Noto Sans KR', sans-serif;
    padding: 10px 40px ;
    background-color: #C6BC77;
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
.container {
  
    width: 100%;
    max-width: 400px;
    background-color: #FFFCEC;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
}

/* 標題 */
.register-box h2 {
  font-family: 'Noto Sans KR', sans-serif;
    margin-bottom: 0px;
    color: #655806;
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
    font-size: 14px;
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
  