<template lang="">
  <!-- 沒註冊過也沒有用line登入的，根本看不到此畫面，因為此畫面只在會員中心中，表示一定有memberid -->
  <!-- 目前已限制必須是有LINEID的用戶才能使用message api通知功能，因此只有網站註冊的要先進行line綁定，而沒註冊但使用Line登入的可直接追蹤商家 -->
  <div class="line-container">
    <!-- 判斷是否已綁定 LineID -->
    <div v-if="!isBound">
      <p>您尚未綁定 LINE，請先進行 LINE 登入：</p>
      <LineLogin @bindingSuccess="handleBindingSuccess" />
    </div>
    <div v-else>
      <p>您的 LINE 帳戶已綁定，請點擊下方按鈕追蹤商家：</p>
      <a href="https://line.me/R/ti/p/@310pndih" target="_blank">
        <img
          height="55"
          alt="加入好友"
          src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"
        />
      </a>
      <!-- 是否已追蹤商家提示文字 -->
      <p v-if="followStatus">✅ 連動成功</p>
      <p v-else>❌ 尚未連動成功</p>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import Swal from "sweetalert2";
import LineLogin from "../login/LineLogin.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

// 狀態
const isBound = ref(false); // 控制顯示line登入或line加好友
const followStatus = ref(null); // 追蹤狀態，null 表示尚未檢查
const userToken = ref(""); // 用戶的 Token
const memberId = ref("");


const baseUrl = import.meta.env.VITE_API_BASE_URL;

// 初始化
const router = useRouter();

onMounted(async () => {
  //這邊要先確認有無持有memberId，表示註冊過，已將此驗證邏輯放在route.js中做全局攔截
  initializeUser();
  if (memberId.value) {
    await checkBindingStatus();  //從member資料表，對應此memberId有無綁定的lineid，用於決定顯示line登入按鈕或是line加好友按鈕
    await checkFollowStatus();  //檢查商家line追蹤狀態，從member資料表，對應此memberId的followed欄位是否為true，是則顯示連動成功
  }
});

// 初始化用戶資訊(驗證有無攜帶token，有的話提取memberid)
function initializeUser() {
  const user = localStorage.getItem("user");
  if (!user) {
    Swal.fire("錯誤", "請重新登入", "error").then(() => {
      router.push("/login");
    });
    return;
  }

  try {
    const parsedUser = JSON.parse(user);
    userToken.value = parsedUser.token;

    // 解析 Token 提取 memberId
    const payload = JSON.parse(atob(userToken.value.split(".")[1])); // 解碼 Base64 Payload
    const subject = JSON.parse(payload.sub); // 提取 subject 並解析為 JSON
    memberId.value = subject.memberId;
  } catch (error) {
    console.error("無法解析 Token: ", error);
    Swal.fire("錯誤", "請重新登入", "error").then(() => {
      router.push("/login");
    });
  }
}

// 方法:用於判斷此用戶的memberId有無綁定一個lineId，有才能直接顯示linebot按鈕，沒有則顯示line登入按鈕
async function checkBindingStatus() {
  try {
    const response = await axios.get(
      `${baseUrl}/line/checkBinding`,
      {
        headers: { Authorization: `Bearer ${userToken.value}` },
      }
    );
    isBound.value = response.data.success;
  } catch (error) {
    console.error("檢查綁定狀態失敗: ", error);
    isBound.value = false;
  }
}

//  方法:檢查商家line追蹤狀態
async function checkFollowStatus() {
  try {
    const response = await axios.get(`${baseUrl}/line/checkFollow`, {
      headers: { Authorization: `Bearer ${userToken.value}` },
      params: { memberId: memberId.value },
    });
    followStatus.value = response.data.followed;
  } catch (error) {
    console.error("無法檢查追蹤狀態: ", error);
    followStatus.value = false;
  }
}

// 綁定成功處理
function handleBindingSuccess() {
  checkBindingStatus();
  checkFollowStatus();
}
</script>
<style scoped>


</style>
