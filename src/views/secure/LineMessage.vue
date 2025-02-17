<template>
  <div class="background">
    <div class="verification-container">
      <h2 class="title">會員通知設定</h2>
      <div class="dot-icon-container">
        <font-awesome-icon
          icon="fa-solid fa-ellipsis"
          style="color: #f7cf40"
          class="dot-icon"
        />
      </div>
      <div class="section">
        <h3 class="section-title">通知工具設定</h3>
        <p>
          建議您完成 Line Messagae 連動。當您設定關鍵事件推播時，即可透過 Line
          接收推播提醒。
        </p>
        <p class="tip">
          ※
          此功能設定由個人自行選擇，但若您有發佈通報或追蹤案件，強烈建議您進行Line
          Messagae連動
        </p>
        <LineBinding class="line-button" />
        <div class="instructions">
          <h4>建動操作說明：</h4>
          <ol>
            <li>若未進行過line登入，請先點選line登入連結</li>
            <li>登入您的 Line 帳密後，畫面即會顯示連動按鈕</li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import LineBinding from "@/components/member/lineMessage/LineBinding.vue";
import { useRoute, useRouter } from "vue-router";
import useUserStore from "@/stores/user";

const route = useRoute();
const router = useRouter();
const lineNotifyStatus = ref(false);
const userStore = useUserStore();

const linkLineNotify = () => {
  console.log("進行 Line Notify 連動...");
  lineNotifyStatus.value = true;
};

//下列程式用來監聽網址列token變化，用於line登入後擷取token並存入Pinia再存入localStorage
onMounted(() => {
  // 使用 watchEffect() 監聽 token 變化，確保提取後再清除 URL
  watchEffect(() => {
    const token = route.query.token;
    if (token) {
      console.log("Token 為:", token);
      userStore.setToken(token); // 儲存 Token
      router.replace({ path: "/advanced-settings", query: {} }); // 移除 Query 參數
    }
  });
});
</script>

<style scoped>
.background {
  background-image: url("@/assets/linemessage-background.jpg");
  background-size: cover; /* 讓背景圖片完全填滿畫面 */
  background-position: left center; /* 確保圖片居中對齊 */
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  overflow: hidden; /* 防止滾動 */
  margin: 0;
  padding: 0;
}

.verification-container {
  max-width: 90%; /* 響應式調整，讓小螢幕有更多空間 */
  width: 500px;
  height: 650px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  border-radius: 15px;
  font-family: Arial, sans-serif;
}

.dot-icon-container {
  display: flex;
  height: 7px;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.dot-icon {
  font-size: 45px;
  letter-spacing: 10px; /* 增加點之間的間距 */
}

.title {
  text-align: center;
  font-size: 1.5rem; /* 響應式文字大小 */
  margin-top: 25px;
  color: #333;
  font-weight: 700;
}

.section {
  padding: 35px;
  border-radius: 8px;
}

.section-title {
  font-size: 1.2rem; /* 響應式文字大小 */
  margin-bottom: 10px;
  color: #e7a90d;
  font-weight: 600;
}

.section p {
  font-weight: 500;
  margin-bottom: 0px;
}

.line-button {
  margin-top: 30px;
  display: flex;
  justify-content: center; /* 水平置中 */
  align-items: center;
}
.tip {
  font-size: 14px;
  margin: 0;
}

.instructions {
  padding: 10px;
  border: 2px dashed #e7a90d;
  border-radius: 5px;
}

.instructions h4 {
  padding: 10px;
  border-radius: 5px;
  font-size: 0.9rem; /* 響應式文字大小 */
  color: #aaa167;
  font-weight: 600;
}

.instructions li {
  letter-spacing: 0.5px;
}

.success {
  color: #28a745;
}
</style>
