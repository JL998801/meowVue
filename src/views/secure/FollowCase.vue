<template>
    <h1>追蹤案件管理</h1>
  <div class="followed-cases">
    <h2>我的追蹤案件</h2>
        <div v-for="caseItem in followedCases" :key="caseItem.followId" class="case-item" >
            <div class="case-content" >
                <h3>
                <RouterLink :to="`/pet/${caseItem.caseType}case/${caseItem.caseId}`" class="case-link">
                    {{ caseItem.title }}
                </RouterLink>
                </h3>
                <div class="case-info">
                    <p>追蹤時間：<span>{{ formatDate(caseItem.followDate) }}</span></p>
                    <p>資訊類別：<span :class="['case-type', getCaseClass(caseItem.caseType)]">{{ getCaseLabel(caseItem.caseType) }}</span></p>
                </div>
            </div>
            <div class="case-actions" >
                <smallFollowButton :follow="caseItem.follow" :caseId="caseItem.caseId" :caseType="caseItem.caseType"  @followUpdated="fetchFollowedCases"/>
            </div>
        </div>   
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import smallFollowButton from "../../components/pet/rescue/follow/smallFollowButton.vue";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const followedCases = ref([]);

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toISOString().slice(0, 10); // 格式：YYYY-MM-DD
};

// ✅ 轉換案件類型為顯示文字
const getCaseLabel = (caseType) => {
  switch (caseType) {
    case "rescue": return "救援案件";
    case "lost": return "遺失案件";
    case "adoption": return "認養案件";
    default: return "未知案件";
  }
};

// ✅ 取得對應的 CSS 類別
const getCaseClass = (caseType) => {
  if (caseType === "rescue") return "rescue-case";
  if (caseType === "lost") return "lost-case";
  if (caseType === "adoption") return "adoption-case";
  return "";
};


// 初始化函數：抓取追蹤案件數據
const fetchFollowedCases = async () => {
  try {
    const token = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).token
      : null;
    if (!token) {
      alert("請先登入！");
      return;
    }

    const response = await axios.get(`${baseUrl}/Case/follow/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    followedCases.value = response.data; // 從後端返回追蹤案件列表
    console.log("追蹤案件列表：", response.data);
  } catch (error) {
    console.error("無法取得追蹤案件列表：", error);
  }
};

onMounted(() => {
  fetchFollowedCases();
});
</script>

<style scoped>


h1 {
  font-size: 30px;
  font-weight: 900;
  margin-bottom: 60px;
}

.followed-cases {
  margin: 20px;
  padding: 10px;
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
  height: 100px;
}

.case-info {
  margin-top: 10px;
    display: flex;
  gap: 100px;
  align-items: center;
}

.case-info p {
  margin: 0;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 400;
  color: #807878;

}

.case-info span {
  font-weight: 400;
  color: #333;
}

.case-item h3{
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.case-content {
  flex-grow: 1;
}

.case-actions {
  color: #ed6c6c;
  font-size: 20px;
  flex-shrink: 0; /* ✅ 確保按鈕不會被壓縮 */
  align-self: flex-start;
  margin: 0;
}

.heart-icon {
  cursor: pointer;
  margin-left: 10px;
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
  height: 100px;
  transition: all 0.3s ease-in-out; /* ✅ 添加過渡動畫 */
}

/* ✅ 滑鼠懸停時陰影 + 邊框變黃橘色 */
.case-item:hover {
  box-shadow: 0 5px 15px rgba(136, 136, 136, 0.5); /* 陰影增加 */
  border-color: #feba07; /* 邊框變黃橘色 */
}

/* ✅ 案件標題超連結 */
.case-link {
  text-decoration: none;
  color: #333; /* 預設黑色 */
  transition: color 0.1s ease-in-out;
}

/* ✅ 滑鼠懸停時變亮變橘色 */
.case-link:hover {
  color: #feba07; /* 橙色 */
  text-decoration: underline;
}

.case-type {
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff !important; /* ✅ 確保字體為白色 */
}

/* ✅ 救援案件 - 桃紅色 */
.rescue-case {
    background-color: #eb8989; 

}

/* ✅ 遺失案件 - 黃色 */
.lost-case {
  background-color: #fff7db;
}

/* ✅ 認養案件 - 藍色 */
.adoption-case {
  background-color: #e6f2ff;
}

</style>
