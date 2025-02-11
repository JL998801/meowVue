<template>
  <div class="rescue-case-page">
    <h1>流浪救援管理</h1>
    <h2>我的救援紀錄</h2>
    <div v-for="caseItem in rescueCases" :key="caseItem.rescueCaseId" class="case-item">
      <div class="case-content">
        <h3>
          <RouterLink :to="`/pet/rescueCase/${caseItem.rescueCaseId}`" class="case-link">
            {{ caseItem.caseTitle }}
          </RouterLink>
        </h3>
        <div class="case-info">
          <p>救援案件編號：{{ caseItem.rescueCaseId }}</p>
          <p><span>最後更新日期：<span class="info">{{ formatDate(caseItem.lastUpdateTime) }}</span></span><span>  建立日期：<span class="info">{{ formatDate(caseItem.publicationTime) }}</span></span></p>
        </div>
      </div>
      <div class="case-status">
        <span :class="getCaseStateClass(caseItem.caseState)">{{
          caseItem.caseState
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const rescueCases = ref([]);

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().slice(0, 10); // YYYY-MM-DD 格式
};

// 獲取案件狀態對應的樣式
const getCaseStateClass = (state) => {
  switch (state) {
    case "待救援":
      return "state-waiting";
    case "已救援":
      return "state-rescued";
    default:
      return "state-unknown";
  }
};

// 獲取救援案件數據
const fetchRescueCases = async () => {
  try {
    const token = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).token
      : null;
    if (!token) {
      alert("請先登入！");
      return;
    }

    const response = await axios.get(`${baseUrl}/RescueCase/memberRescueCases`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    rescueCases.value = response.data;
  } catch (error) {
    console.error("無法獲取救援案件列表：", error);
  }
};

onMounted(() => {
  fetchRescueCases();
});
</script>

<style scoped>
.rescue-case-page {
    margin: 20px;
    padding: 10px;
}


h1 {
  font-size: 30px;
  font-weight: 900;
  margin-bottom: 60px;
}

h2 {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 50px;
}

.case-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 27px;
  margin-bottom: 15px;
  border: 2px solid #e2e2e2;
  border-radius: 28px;
  background-color: #ffffff;
  width: 700px;
  height: 150px;
  transition: all 0.2s ease-in-out;
}

.case-item h3{
  font-size: 19px;
  font-weight: 700;
  margin-bottom: 10px;
}

/* ✅ 滑鼠懸停時陰影 + 邊框變黃橘色 */
.case-item:hover {
  box-shadow: 0 5px 15px rgba(136, 136, 136, 0.5); /* 陰影增加 */
  border-color: #feba07; /* 邊框變黃橘色 */
}

.case-content {
  flex: 1;
}

/* ✅ 案件標題超連結 */
.case-link {
  text-decoration: none;
  color: #333; /* 預設黑色 */
  transition: color 0.2s ease-in-out;
}

/* ✅ 滑鼠懸停時變亮變橘色 */
.case-item:hover .case-link {
  color: #feba07; /* 橙色 */
  text-decoration: underline;
}

.case-info{
    margin-top: 20px;
    margin-left: 0;
}

.case-info p {
  color: #666;
  margin: 0;
  margin-bottom: 5px;
}

.case-info p span {
    margin-right: 30px;
 
} 

.info{
    color:#333
}

.case-status {
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}

/* 待救援 */
.state-waiting {
  color: #e74c3c; /* 字體顏色 */
  background-color: #fbe3e3; /* 背景色 */
  padding: 5px 10px;
  border-radius: 10px; 
  display: inline-block;
}

/* 已救援 */
.state-rescued {
  color: #f39c12; /* 字體顏色 */
  background-color: #fdebd0; /* 背景色 */
  padding: 5px 10px;
  border-radius: 10px; 
  display: inline-block;
}

.state-unknown {
  color: #95a5a6; /* 字體顏色 */
  background-color: #ecf0f1; /* 背景色 */
  padding: 5px 10px;
  border-radius: 10px; 
  display: inline-block;
}
</style>
