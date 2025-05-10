<template>
  <div v-if="isLoading" class="loading">🔄 載入中...</div>
  <div v-else-if="caseData && Object.keys(caseData).length > 0" class="post">
    <div class="post-image">
      <img 
        :src="caseData.casePictures?.[0]?.pictureUrl || '/images/default.png'" 
        :alt="caseData.caseTitle || '案件圖片'" 
      />
    </div>

    <div class="post-details">
      <div class="info">
        <div class="post-id">遺失案件編號 : {{ caseData.lostCaseId || '未知' }}</div>
        <div class="case-status" :class="getStatusClass(caseData.caseState?.caseStateId)">
          {{ caseData.caseState?.caseStatement || "未知狀態" }}
        </div>
      </div>
      <div class="info-3">
        建立日期: {{ formatDate(caseData.publicationTime) }}
      </div>

      <h2 class="case-title">
        [{{ caseData.city?.city || '未知城市' }}{{ caseData.districtArea?.districtAreaName || '' }}]
        {{ caseData.caseTitle || '未命名案件' }}
      </h2>

      <div class="post-details-p">
        <p>寵物類別：{{ caseData.species?.species || '未知' }}</p>
        <p>寵物名稱：{{ caseData.name || '未知' }}</p>
        <p>性別：{{ caseData.gender || '未知' }}</p>
        <p>品種：{{ caseData.breed?.breed || '未知' }}</p>
        <p>毛色：{{ caseData.furColor?.furColor || '未知' }}</p>
        <p>絕育狀態：{{ caseData.sterilization || '未知' }}</p>
        <p>晶片號碼：{{ caseData.microChipNumber || "無" }}</p>
        <p>地點: {{ caseData.city?.city || '未知城市' }}{{ caseData.districtArea?.districtAreaName || '' }}{{ caseData.street || '' }}</p>
        <p>走失經過：{{caseData.lostExperience}}</p>
        <p>特徵描述:{{caseData.featureDescription}} </p>
        <p>聯絡資訊: {{caseData.contactInformation}}</p>
      </div>
    </div>
  </div>
  <div v-else class="no-data">⚠️ 查無案件資料</div>
</template>


<script setup>
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import useLostCases from "@/components/pet/lost/useLostCases.js";

// ✅ 取得 `useLostCases` 提供的 API 方法
const { fetchLostCaseById } = useLostCases();

// ✅ 取得當前路由參數
const route = useRoute();
const lostCaseId = ref(route.params.id);

// ✅ 設定 `caseData` 預設為 `null`，確保 Vue 能監聽變化
const caseData = ref(null);

// ✅ 設定 `isLoading` 來管理請求狀態
const isLoading = ref(true);

// ✅ 監聽 `lostCaseId` 變化，自動獲取案件資料
watchEffect(async () => {
    if (!route.params.id) return;

    lostCaseId.value = route.params.id;
    console.log("🚀 取得案件 ID:", lostCaseId.value);

    isLoading.value = true; // 🔄 請求前顯示載入狀態
    const response = await fetchLostCaseById(lostCaseId.value);

    if (response) {
        caseData.value = { ...response }; // ✅ 確保 Vue 能正確監聽數據變化
        console.log("✅ 成功載入案件數據:", caseData.value);
    } else {
        console.warn("⚠️ 無法獲取案件數據，請檢查 API 是否正常");
        caseData.value = {}; // ✅ API 失敗時設置為 `{}`，避免 `null`
    }
    isLoading.value = false; // ✅ API 請求完成，關閉載入狀態
});

// ✅ 設定案件狀態樣式
const getStatusClass = (caseStateId) => {
    return caseStateId === 5 ? "status-pending" : 
           caseStateId === 6 ? "status-found" : 
           "status-unknown";
};

// ✅ 格式化日期
const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "未知日期";
};
</script>

<style scoped>
.user-icon{
    margin-right: 6px;
    color:#dbdddc;
    font-size: 24px;
}

.view-icon{
    margin-right: 3px;
    color:#dbdddc;
    font-size: 20px;
}

.heart-icon{

    margin-right: 3px;
    color:#ed6c6c;
    font-size: 20px;
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
  margin-top: 45px;
  margin-left: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
}

.views-and-follows span {
  margin-right: 16px;
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