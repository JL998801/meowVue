<template>
  <div class="member-container">
    <div class="profile-section">
      <div class="profile-card">
        <img
          :src="profileImage || 'defaultProfilePic.jpg'"
          class="profile-img"
        />
        <h3>{{ nickName }}</h3>
        <p>會員 ID：{{ memberId }}</p>

        <div class="contact-info">
          <label>電子郵件</label>
          <p class="contact-text">{{ email }}</p>

          <label>手機號碼</label>
          <p class="contact-text">{{ phone }}</p>
        </div>
      </div>
    </div>

    <div class="info-section">
      <div class="case-stats">
        <div class="stat-box">
          <p class="stat-number">{{ rescueCases }}</p>
          <p>救援案件數</p>
        </div>
        <div class="stat-box">
          <p class="stat-number">{{ fosterCases }}</p>
          <p>送養案件數</p>
        </div>
        <div class="stat-box">
          <p class="stat-number">{{ lostCases }}</p>
          <p>遺失案件數</p>
        </div>
        <div class="stat-box">
          <p class="stat-number">{{ adoptionCases }}</p>
          <p>領養案件數</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { axiosapi2 } from "@/plugins/axios.js"; // 直接用 axios，確保請求正常發送

import { useRoute } from "vue-router";
// ✅ 取得當前路由
const route = useRoute();
const memberId = ref(route.params.memberId); // 透過路由參數獲取 memberId

const profileImage = ref("");
const nickName = ref("");
const email = ref("");
const phone = ref("");
const rescueCases = ref(0);
const fosterCases = ref(0);
const lostCases = ref(0);
const adoptionCases = ref(0);

const fetchMemberData = async () => {
  if (!memberId.value) {
    console.error("會員 ID 未定義");
    return;
  }

  try {
    const response = await axiosapi2.get(`/register/${memberId.value}/profile`);
    const data = response.data;

    if (data) {
      profileImage.value = data.linePicture || "defaultProfilePic.jpg";
      nickName.value = data.lineName || "未知";
      email.value = data.email || "無";
    }
  } catch (error) {
    console.error("載入會員資料時發生錯誤:", error);
  }
};

// ✅ 監聽路由變化，如果 `memberId` 改變就重新加載資料
watch(
  () => route.params.memberId,
  (newMemberId) => {
    memberId.value = newMemberId;
    fetchMemberData();
  }
);

onMounted(fetchMemberData);
</script>

<style scoped>
.member-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 80%;
  margin: auto;
}
.profile-section {
  flex: 1;
}
.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.profile-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.contact-info {
  margin-top: 15px;
  text-align: center;
}
.contact-info label {
  font-weight: bold;
  display: block;
}
.contact-text {
  background: #f8f8f8;
  padding: 5px;
  border-radius: 5px;
  margin: 5px 0;
}
.info-section {
  flex: 2;
}
.case-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}
.stat-box {
  background: #f8f8f8;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}
</style>
