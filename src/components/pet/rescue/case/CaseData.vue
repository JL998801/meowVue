<template lang="">
    <div class="post">
    <div class="post-image">
      <img
        :src="caseData.casePictures?.[0].pictureUrl"
        :alt="caseData.caseTitle"
      />
    </div>
    <div class="post-details">
      <div class="info">
        <div class="post-id">救援案件編號 : {{ caseData.rescueCaseId }}</div>
        <div class="case-status" :class="statusClass(caseData.caseState)" >
          {{ caseData.caseState }}
        </div>
      </div>
      <div class="info-3">
        建立日期: {{ formatDate(caseData.publicationTime) }}
      </div>
        <h2 class="case-title">
          [{{ caseData.cityName }}{{ caseData.districtAreaName }}]
          {{ caseData.caseTitle }}
        </h2>
      <div class="post-details-p">
        <p>動物類別：{{ caseData.species }}</p>
        <p>動物品種：{{ caseData.breed }}</p>
        <p>地點: {{ caseData.cityName }}{{ caseData.districtAreaName }}{{caseData.street}} </p>
        <p>救援需求：{{  caseData.rescueDemands?.join("、") || "無資料"}}</p>
        <p>通報人可負擔事項：{{ caseData.canAffords?.join("、") || "無資料"}}</p>
      </div>
      <div class="case-footer">
        <p>
            <font-awesome-icon icon="fa-solid fa-circle-user"  class="user-icon" />發文者：<span class="author">{{ caseData.memberNickName }}</span>
        </p>
        <div class="views-and-follows">
          <div class="viewCount">
            <font-awesome-icon icon="fa-solid fa-eye" class="view-icon"/><span>{{ caseData.viewCount || 0 }}</span> 
          </div>
            <followButton :follow="caseData.follow" :caseId="caseData.rescueCaseId" caseType="rescue"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";
import followButton from "@/components/pet/rescue/follow/followButton.vue";



//從RescueCase父組件傳遞的caseData
defineProps({
    caseData: {
    type: Object,
    required: true,
  },
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

.viewCount{
  margin-right: 10px ;
}

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
}

.case-footer {
  margin-top: 8px;
  margin-left: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
}

.case-footer p{
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

.post {
  display: flex;
  flex: 0 0 80%;
  margin-top: 50px;
  padding-bottom: 35px;
}

.views {
  color: #333;
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
  max-width: 50%;
  text-align: center;
  order: -1;
}

.post-image img {
  max-width: 100%;
  width: 325px;
  height: 325px;
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