<template>
  <div class="lost-management-container">
    <main class="content">
      <h2>遺失協尋管理</h2>

      <div class="section-indicator">
        <span
          v-for="(dot, index) in 3"
          :key="index"
          class="dot"
          :class="{ active: index === 0 }"
        ></span>
      </div>

      <div v-if="isLoading" class="loading">載入中...</div>
      <div v-else-if="losts.length === 0" class="no-records">查無紀錄。</div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>案件編號</th>
              <th>標題</th>
              <th>案件狀態</th>
              <th>寵物類別</th>
              <th>寵物名稱</th>
              <th>品種</th>
              <th>會員ID</th>
              <th>建立日期</th>
              <th>最後更新</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lost in losts" :key="lost.lostCaseId">
              <td>{{ lost.lostCaseId }}</td>
              <td>{{ lost.caseTitle }}</td>
              <td>
                <span class="status">{{ lost.caseState }}</span>
              </td>
              <td>{{ lost.species }}</td>
              <td>{{ lost.name }}</td>
              <td>{{ lost.breed }}</td>
              <td>{{ lost.memberId }}</td>
              <td>{{ formatDate(lost.publicationTime) }}</td>
              <td>{{ formatDate(lost.lastUpdateTime) }}</td>
              <td>
                <button
                  class="expand-btn"
                  @click="toggleExpand(lost.lostCaseId)"
                >
                  {{
                    expandedCases.includes(lost.lostCaseId) ? "收起" : "展開"
                  }}
                </button>
              </td>
            </tr>
            <!-- 展開的額外資訊 -->
            <tr
              v-show="expandedCases.includes(lost.lostCaseId)"
              class="expanded-content"
              v-for="lost in losts"
              :key="'expand-' + lost.lostCaseId"
            >
              <td colspan="9">
                <p>毛色：{{ lost.furColor }}</p>
                <p>絕育狀態：{{ lost.sterilization }}</p>
                <p>晶片號碼：{{ lost.microChipNumber }}</p>
                <p>
                  地點: {{ lost.cityName }}{{ lost.districtAreaName
                  }}{{ lost.street }}
                </p>
                <p>走失經過：{{ lost.lostExperience }}</p>
                <p>特徵描述: {{ lost.featureDescription }}</p>
                <p>聯絡資訊: {{ lost.contactInformation }}</p>
                <!-- 🔹 新增隱藏按鈕 -->
                <button class="hide-btn" @click="hideLostCase(lost.lostCaseId)">
                  隱藏
                </button>
                <!-- <button class="modify-btn" :disabled="lost.isHidden">修改</button> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button
          class="page-btn"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          &lt; 上一頁
        </button>
        <span class="current-page">{{ currentPage }}</span>
        <button
          class="page-btn"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
        >
          下一頁 &gt;
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useUserStore from "@/stores/user.js";
import { axiosapi } from "@/plugins/axios.js";

const userStore = useUserStore();
const losts = ref([]);
const isLoading = ref(true);
const expandedCases = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const banners = ref([]); // 廣告列表

const fetchLostCases = async () => {
  try {
    isLoading.value = true;
    const response = await axiosapi.get("/lostcases/all");

    // ✅ 確保 API 返回的資料結構與前端對應
    losts.value = response.data.map((lost) => ({
      lostCaseId: lost.lostCaseId,
      caseTitle: lost.caseTitle,
      name: lost.name,
      gender: lost.gender || "未知",
      sterilization: lost.sterilization,
      microChipNumber: lost.microChipNumber || "無",
      caseState: lost.caseState,
      species: lost.species,
      breed: lost.breed,
      memberId: lost.memberId,
      furColor: lost.furColor,
      memberNickName: lost.memberNickName,
      publicationTime: lost.publicationTime,
      lastUpdateTime: lost.lastUpdateTime,
      contactInformation: lost.contactInformation || "無聯絡資訊",
      featureDescription: lost.featureDescription,
      lostExperience: lost.lostExperience,
      cityName: lost.cityName,
      districtAreaName: lost.districtAreaName,
      street: lost.street || "",
      //isHidden: lost.hidden, // 標記案件是否被隱藏
    }));

    totalPages.value = Math.ceil(response.data.length / 10);
  } catch (error) {
    console.error("❌ 無法獲取遺失案件:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchLostCases();
});
const formatDate = (dateString) => {
  if (!dateString) return "未知日期";

  const date = new Date(dateString);
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchLostCases();
  }
};

const toggleExpand = (caseId) => {
  if (expandedCases.value.includes(caseId)) {
    expandedCases.value = expandedCases.value.filter((id) => id !== caseId);
  } else {
    expandedCases.value.push(caseId);
  }
};
</script>

<style scoped>
/* 隱藏按鈕 */
.hide-btn {
  background-color: #d0ccd0; /* 使用較淡的灰色 */
  color: black;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.hide-btn:hover {
  background-color: #c6bc77;
}

/* 整體背景 */
.lost-management-container {
  background-color: #f9f9f9;
  min-height: 100vh;
  padding: 20px;
}

/* 標題樣式 */
h2 {
  background-color: #c7c7c7;
  color: black;
  text-align: center;
  padding: 15px;
  border-radius: 8px;
}

/* 表格容器 */
.table-container {
  margin-top: 20px;
  overflow-x: auto;
}

/* 表格樣式 */
table {
  width: 100%;
  border-collapse: collapse;
  background-color: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
}

th,
td {
  border: 2px solid #c7c7c7;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #c7c7c7;
  color: black;
}

/* 案件狀態標籤 */
.status {
  background-color: #feba07;
  color: black;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
}

/* 按鈕樣式 */
.expand-btn {
  background-color: #c6bc77;
  color: black;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 5px;
}

.expand-btn:hover {
  background-color: #feba07;
}

/* 分頁按鈕 */
.pagination {
  margin-top: 20px;
  text-align: center;
}

.page-btn {
  background-color: #c6bc77;
  color: black;
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
}

.page-btn:hover {
  background-color: #feba07;
}

.current-page {
  font-weight: bold;
  color: black;
  font-size: 18px;
}
</style>
