<template>
  <div class="member-container">
    <div class="profile-card">
      <img :src="profileImage" class="profile-img" />
      <h3>{{ nickName }}</h3>
      <p>會員 ID：{{ memberId }}</p>
    </div>

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

    <form @submit.prevent="updateProfile" class="profile-form">
      <label>姓名</label>
      <input type="text" v-model="name" readonly />

      <label>電子郵件</label>
      <input type="email" v-model="email" readonly />

      <label>手機號碼</label>
      <input type="text" v-model="phone" />
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { axiosapi } from "@/plugins/axios";
import Swal from "sweetalert2";

const memberId = localStorage.getItem("memberId");
const profileImage = ref("defaultProfilePic.jpg");
const nickName = ref("");
const name = ref("");
const email = ref("");
const ob = ref("");
const phone = ref("");
const rescueCases = ref(0);
const fosterCases = ref(0);
const lostCases = ref(0);
const adoptionCases = ref(0);

const fetchMemberData = async () => {
  if (!memberId) return;
  try {
    const { data } = await axiosapi.get(`/members/${memberId}`);
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

const updateProfile = async () => {
  try {
    const updatedData = {
      birthday: dob.value,
      address: address.value,
      phone: phone.value,
      notifyExchange: notifyExchange.value,
      notifyEvent: notifyEvent.value,
    };
    await axiosapi.put(`/members/${memberId}`, updatedData);
    Swal.fire({
      icon: "success",
      title: "資料更新成功",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "更新失敗",
    });
  }
};

onMounted(fetchMemberData);
</script>

<style scoped>
.member-container {
  width: 80%;
  margin: auto;
  text-align: center;
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
.case-stats {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.stat-box {
  background: #f8f8f8;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  text-align: center;
}
.profile-form {
  margin-top: 20px;
}
button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}
button:hover {
  background: #0056b3;
}
</style>
