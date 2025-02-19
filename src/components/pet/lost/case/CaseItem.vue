<template>
  <div class="post">
    <div class="post-image">
    <img
      :src="pictureUrls.length > 0 ? pictureUrls[0] : defaultImage"
      :alt="caseItem.caseTitle"
    />
  </div>
    <div class="post-details">
      <div class="info">
        <div class="post-id">
          遺失案件編號 : {{ caseItem.lostCaseId || caseItem.rescueCaseId || "未知" }}
        </div>
        <div class="case-status" :class="statusClass(caseItem.caseState.caseStatement)">
          {{ caseItem.caseState.caseStatement }}
        </div>
      </div>
      <div class="info-3">
        建立日期: {{ formatDate(caseItem.publicationTime) }}
      </div>
      <router-link :to="`/pet/lostCases/${caseItem.lostCaseId}`">
        <h2 class="case-title">
          [{{ caseItem.city.city }}{{ caseItem.districtArea.districtAreaName }}]
          {{ caseItem.caseTitle }}
        </h2>
      </router-link>
      <div class="post-details-p">
        <p>寵物類別：{{ caseItem.species.species }}</p>
        <p>寵物姓名：{{ caseItem.name }}</p>
        <p>寵物性別：{{ caseItem.gender }}</p>
        <p>寵物品種：{{ caseItem.breed.breed }}</p>
        <p>絕育狀態：{{ caseItem.sterilization || '未知' }}</p>
        <p>附近地標：{{ caseItem.street }}</p>
      </div>
      <div class="case-footer">
        <p>
          <font-awesome-icon icon="fa-solid fa-circle-user" class="user-icon" />
          發文者：<span class="author">{{ caseItem.memberNickName }}</span>
        </p>
        <div class="views-and-follows">
          <div class="viewCount">
            <font-awesome-icon icon="fa-solid fa-eye" class="view-icon" />
            <span>{{ caseItem.viewCount || 0 }}</span>
          </div>
          <followButton
            :follow="caseItem.follow"
            :caseId="caseItem.lostCaseId"
            caseType="lost"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import followButton from "@/components/pet/rescue/follow/followButton.vue";
import {axiosapi} from "@/plugins/axios.js";

// 父組件傳遞的案件資訊
const props = defineProps({
  caseItem: {
    type: Object,
    required: true,
  },
});

const pictureUrls = ref([]);
const defaultImage = "/images/default.png"; // 預設圖片
// const memberNickName = ref(""); // 預設發文者名稱

// 獲取環境變數 API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"; 

const getCasePictures = async () => {
  try {
    if (!props.caseItem?.lostCaseId) {
      pictureUrls.value = [defaultImage];
      return;
    }

    // 向後端請求案件圖片數據
    const response = await axiosapi.get(`/lostcases/${props.caseItem.lostCaseId}`);

    if (response.data && response.data.casePictures && response.data.casePictures.length > 0) {
      // 從 casePictures 陣列中提取圖片 URL，並轉換為可用的 URL
      pictureUrls.value = response.data.casePictures.map(pic => convertBackendPath(pic.pictureUrl));
    } else {
      pictureUrls.value = [defaultImage]; // 若無圖片，使用預設圖片
    }
  } catch (error) {
    console.error("獲取圖片失敗：", error);
    pictureUrls.value = [defaultImage]; // 失敗時使用預設圖片
  }
};

// 將後端的本機路徑轉換為前端可讀取的 URL
const convertBackendPath = (path) => {
  if (!path) return defaultImage;
  
  // 避免 URL 重複轉換
  if (path.startsWith("http")) {
    return path;
  }

  return path.replace("C:/upload/final/pet/images/", `${API_BASE_URL}/upload/final/pet/images/`);
};

// 組件載入時請求圖片數據
onMounted(() => {
  getCasePictures();
  // fetchAllCasesAndSetNickName();
  console.log("caseItem 數據:", props.caseItem);
});

// 格式化日期函數
const formatDate = (date) => {
  if (!date) return "未知日期";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(date).toLocaleDateString("zh-TW", options);
};

// 狀態樣式類別
const statusClass = (caseState) => {
  switch (caseState) {
    case "待協尋":
      return "status-pending";
    case "已尋獲":
      return "status-completed";
    default:
      return "status-default";
  }
};
</script>


<style scoped>
a {
  text-decoration: none; /* 移除底線 */
  color: inherit; /* 讓顏色繼承父層的設定 */
}

.post-id {
  font-weight: 400;
  letter-spacing: 0.5px;
}

.case-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 4px;
}

/* 待救援 */
.status-pending {
  background-color: #ed6c6c;
  color: #ffffff;
}

/* 已救援 */
.status-completed {
  background-color: #feba07;
  color: #ffffff;
}

.case-title {
  font-size: 21px;
  letter-spacing: 0.5px;
  font-weight: 700;
  margin-bottom: 8px;
  transition: color 0.2s ease-in-out, text-decoration 0.2s ease-in-out;
  cursor: pointer;
}

.case-title:hover {
  color: #feba07;
  text-decoration: underline;
}

.case-footer {
  margin-top: 8px;
  margin-left: 23px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
}

.case-footer p {
  width: 100%;
}

.views-and-follows {
  display: flex;
  align-items: center; /* 讓所有子元素垂直居中對齊 */
  justify-content: flex-end; /* 讓內容靠右對齊 */
  gap: 5px; /* 控制圖示與按鈕之間的間距 */
  width: 100%; /* 讓 flex 容器填滿可用空間 */
}

.author {
  color: #afa66b;
}

.user-icon {
  margin-right: 6px;
  color: #dbdddc;
  font-size: 24px;
}

.view-icon {
  margin-right: 5px;
  color: #dbdddc;
  font-size: 20px;
}

.heart-icon {
  margin-right: 3px;
  color: #ed6c6c;
  font-size: 20px;
}

.post {
  display: flex;
  flex: 0 0 80%;
  margin-bottom: 20px;
  margin-top: 40px;
  padding-bottom: 40px;
  border-bottom: #eae9e9 2px solid;
}

.views {
  color: #333;
}

.viewCount {
  margin-right: 10px;
}

.info {
  display: flex;
  color: #b4ab6d;
  font-weight: 700;
  font-size: 17px;
  display: flex;
  justify-content: space-between;
}

.info-3 {
  font-size: 14px;
  letter-spacing: 0.5px;
  margin: 0px;
  padding: 0px;
  margin-bottom: 20px;
}

.post-image {
  flex: 0 1 45%;
  max-width: 30%;
  text-align: center;
  order: -1;
}

.post-image img {
  max-width: 100%;
  width: 230px;
  height: 230px;
  border-radius: 8px;
  object-fit: cover;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.post-image img:hover {
  transform: scale(1.05); /*略微放大圖片 */
}

.post-details p {
  margin: 8px 0;
}

.post-details {
  flex: 1 0 40%;
  width: 250px;
  padding-left: 50px;
}

.post-details-p {
  margin-top: 20px;
  margin-bottom: 5%;
  color: #333;
  font-weight: 400;
  border-left: 2px solid #dbdddc;
  padding-left: 16px;
}

.info-4 {
  margin-top: 40px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.suspected-lost {
  color: red;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
}
</style>
