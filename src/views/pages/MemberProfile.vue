<template>
  <div class="member-container">
    <div class="profile-section">
      <div class="profile-card">
        <img :src="profileImage" class="profile-img" />
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
import { ref, onMounted, computed } from "vue";
import { axiosapi2 } from "@/plugins/axios";
import Swal from "sweetalert2";
import useUserStore from "@/stores/user";

const userStore = useUserStore();

const memberId = computed(() => userStore.memberId);
const profileImage = ref("defaultProfilePic.jpg");
const nickName = ref("");
const name = ref("");
const email = ref("");
const ob = ref("");
const address = ref("");
const phone = ref("");
const notifyExchange = ref("啟用");
const notifyEvent = ref("啟用");
const rescueCases = ref(0);
const fosterCases = ref(0);
const lostCases = ref(0);
const adoptionCases = ref(0);

const fetchMemberData = async () => {
  if (!memberId) return;
  try {
    const { data } = await axiosapi2.get(`/members/${memberId}`);
    if (data) {
      nickName.value = data.nickName || "未設定";
      name.value = data.name || "未設定";
      email.value = data.email || "未設定";
      phone.value = data.phone || "未設定";
      address.value = data.address || "未設定";
      dob.value = data.birthday || "1990-01-01";
      profileImage.value = data.profileImage || "defaultProfilePic.jpg";
      notifyExchange.value = data.notifyExchange || "啟用";
      notifyEvent.value = data.notifyEvent || "啟用";
      rescueCases.value = data.rescueCases || 0;
      fosterCases.value = data.fosterCases || 0;
      lostCases.value = data.lostCases || 0;
      adoptionCases.value = data.adoptionCases || 0;
    }
  } catch (error) {
    console.error("載入會員資料失敗", error);
  }
};

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
