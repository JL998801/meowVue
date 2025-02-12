<template>
  <div class="case-list">
    <!-- 排序按鈕 -->
    <div class="sort-buttons">
      <button
        @click="changeSortOrder('desc')"
        :class="{ active: sortOrder === 'desc' }"
      >
        新到舊
      </button>
      <button
        @click="changeSortOrder('asc')"
        :class="{ active: sortOrder === 'asc' }"
      >
        舊到新
      </button>
    </div>

    <table>
      <thead>
        <tr>
          <th>案件ID</th>
          <th>案件圖片</th>
          <th>案件標題</th>
          <th>救援狀態</th>
          <th>觀看人次</th>
          <th>追蹤人次</th>
          <th>發布時間</th>
          <th>最後更新時間</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="caseItem in rescueCaseList" :key="caseItem.rescueCaseId">
          <td>{{ caseItem.rescueCaseId }}</td>
          <td>
            <img
              v-if="caseItem.casePictures.length"
              :src="caseItem.casePictures[0].pictureUrl"
              class="case-image"
            />
          </td>
          <td>{{ caseItem.caseTitle }}</td>
          <td>
            <div class="case-status" :class="statusClass(caseItem.caseState)">
              {{ caseItem.caseState }}
            </div>
          </td>
          <td>{{ caseItem.viewCount }}</td>
          <td>{{ caseItem.follow }}</td>
          <td>{{ formatDate(caseItem.publicationTime) }}</td>
          <td>{{ formatDate(caseItem.lastUpdateTime) }}</td>
          <td>
            <button @click="viewCase(caseItem.rescueCaseId)" class="btn-view">
              查看
            </button>
            <button
              @click="deleteCase(caseItem.rescueCaseId)"
              class="btn-delete"
            >
              刪除
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="isLoading" class="loading">加載中...</div>
    <div v-else-if="!hasMore" class="no-more">沒有更多數據</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const props = defineProps({ searchParams: Object });

const rescueCaseList = ref([]);
const offset = ref(0);
const limit = 10;
const isLoading = ref(false);
const hasMore = ref(true);
const sortOrder = ref("desc"); // 預設為「新到舊」

// ✅ **載入案件數據**
const fetchCases = async () => {
  if (isLoading.value || !hasMore.value) return;
  isLoading.value = true;

  try {
    const response = await axios.get(`${baseUrl}/RescueCase/search/allCases`, {
      params: { offset: offset.value, limit, sortOrder: sortOrder.value },
    });

    rescueCaseList.value = response.data.cases;
    offset.value += limit;
    hasMore.value = response.data.hasMore;
  } catch (error) {
    console.error("加載案件數據失敗：", error);
  } finally {
    isLoading.value = false;
  }
};

// ✅ **變更排序方式 (新到舊 / 舊到新)**
const changeSortOrder = (order) => {
  if (sortOrder.value === order) return;
  sortOrder.value = order;
  offset.value = 0;
  rescueCaseList.value = [];
  fetchCases();
};

// ✅ **刪除案件**
const deleteCase = async (caseId) => {
  try {
    await axios.delete(`${baseUrl}/RescueCase/delete/${caseId}`);
    rescueCaseList.value = rescueCaseList.value.filter(
      (c) => c.rescueCaseId !== caseId
    );
  } catch (error) {
    console.error("刪除案件失敗:", error);
  }
};

// ✅ **查看案件**
const viewCase = (caseId) => {
  window.open(`/pet/rescueCase/${caseId}`, "_blank");
};

// ✅ **格式化日期 (YYYY-MM-DD HH:mm:ss)**
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date
    .toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(/\//g, "-");
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

onMounted(fetchCases);

watch(
  () => props.searchParams,
  async (newParams) => {
    if (Object.keys(newParams).length === 0) return;
    isLoading.value = true;

    try {
      const response = await axios.post(
        `${baseUrl}/RescueCase/search/infinite`,
        newParams,
        {
          params: { offset: 0, limit: 10, sortOrder: sortOrder.value },
        }
      );

      rescueCaseList.value = response.data.cases;
      offset.value = response.data.cases.length;
      hasMore.value = response.data.cases.length === limit;
    } catch (error) {
      console.error("搜尋失敗：", error);
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.case-list {
  padding: 10px;
  overflow-y: auto;
}

/* ✅ 新增排序按鈕 */
.sort-buttons {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.sort-buttons button {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  background-color: #ddd;
  cursor: pointer;
}

.sort-buttons button.active {
  background-color: #007bff;
  color: white;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th,
td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
}

.case-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.btn-view {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 5px;
}

.btn-delete {
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
}

.btn-view:hover {
  background-color: #0056b3;
}

.btn-delete:hover {
  background-color: #c82333;
}

.loading,
.no-more {
  text-align: center;
  margin-top: 10px;
}

.case-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
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
</style>
