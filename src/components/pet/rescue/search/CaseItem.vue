<template>
  <div class="post">
    <div class="post-image">
      <img
        :src="caseItem.casePictures?.[0].pictureUrl || '/placeholder-image.jpg'"
        :alt="caseItem.caseTitle"
      />
    </div>
    <div class="post-details">
      <div class="info">
        <div class="post-id">救援案件編號 : {{ caseItem.rescueCaseId }}</div>
        <div class="case-status" :class="statusClass(caseItem.caseState)">
          {{ caseItem.caseState }}
        </div>
      </div>
      <div class="info-3">
        建立日期: {{ formatDate(caseItem.publicationTime) }}
      </div>
      <router-link :to="`/pet/rescueCase/${caseItem.rescueCaseId}`">
        <h2 class="case-title">
          [{{ caseItem.cityName }}{{ caseItem.districtAreaName }}]
          {{ caseItem.caseTitle }}
        </h2>
      </router-link>
      <div class="post-details-p">
        <p>動物類別：{{ caseItem.species }}</p>
        <p>動物品種：{{ caseItem.breed }}</p>
        <p>救援需求：{{ caseItem.rescueDemands.join(" ") }}</p>
        <p>通報人可負擔事項：{{ caseItem.canAffords.join("、") }}</p>
 
      </div>
      <div class="case-footer">
        <p>
          <font-awesome-icon icon="fa-solid fa-circle-user"  class="user-icon" />發文者：<span class="author">{{ caseItem.memberNickName }}</span>
        </p>
        <div class="views-and-follows">
        <div class="viewCount">
          <font-awesome-icon icon="fa-solid fa-eye" class="view-icon"/><span>{{ caseItem.viewCount || 0 }}</span>
        </div>
         <followButton :follow="caseItem.follow" :caseId="caseItem.rescueCaseId" caseType="rescue"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import followButton from "../follow/followButton.vue";

//父組件傳遞的案件資訊
defineProps({
  caseItem: {
    type: Object,
    required: true,
  },
});

const pictureUrls = ref([]);

//向後端請求對應案件的圖片(會獲得後端路徑，要在此改為前端路徑)
const getCasePictures = () => {};

// 格式化日期函數
const formatDate = (date) => {
  if (!date) return "未知日期";
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  return new Date(date).toLocaleDateString("zh-TW", options);
};

// 狀態樣式類別
const statusClass = (caseState) => {
  switch (caseState) {
    case "待救援":
      return "status-pending";
    case "已救援":
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

.user-icon{
    margin-right: 6px;
    color:#dbdddc;
    font-size: 24px;
}


.view-icon{
    margin-right:5px;
    color:#dbdddc;
    font-size: 20px;
}

.heart-icon{

    margin-right: 3px;
    color:#ed6c6c;
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

.viewCount{
  margin-right: 10px ;
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
</style>
