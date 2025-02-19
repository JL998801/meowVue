<template>
  <div @scroll="handleScroll" ref="scrollContainer"></div>
  <div class="case-list">
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
              @click="$emit('deleteCase', caseItem.rescueCaseId)"
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
import { axiosapi2 } from "@/plugins/axios.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const props = defineProps({ searchParams: Object });

// 響應式數據
const rescueCaseList = ref([]); // 案件數據
const offset = ref(0); // 當前偏移量
const limit = 10; // 每次請求數據量
const isLoading = ref(false); // 加載狀態
const hasMore = ref(true); // 是否還有更多數據
const sortOrder = ref("desc");
const scrollContainer = ref(null); // 滾動容器引用
const cases = ref([]);

// 用戶一跳入頁面後請求案件數據
const fetchCases = async () => {
  if (isLoading.value || !hasMore.value) return; // 如果正在加載或沒有更多數據，直接返回

  isLoading.value = true; // 開始加載
  try {
    const response = await axiosapi2.get(`/RescueCase/search/allCases`, {
      params: { offset: offset.value, limit, sortOrder: "desc" },
    });

    // 更新案件數據
    console.log("剛入頁面後端分批返回全部數據：", response.data.cases); // 調試數據結構
    rescueCaseList.value.push(...response.data.cases); // 新數據追加到現有數據中
    offset.value += limit; // 更新偏移量
    hasMore.value = response.data.hasMore; // 更新是否還有更多數據
  } catch (error) {
    console.error("加載案件數據失敗：", error);
  } finally {
    isLoading.value = false; // 加載結束
  }
};

//刪除案件
const deleteCase = async (caseId) => {
  try {
    console.log("要刪除案件id", caseId);
    await axiosapi2.delete(`/RescueCase/delete/${caseId}`);
    rescueCaseList.value = rescueCaseList.value.filter(
      (c) => c.rescueCaseId !== caseId
    );
  } catch (error) {
    console.error("刪除案件失敗:", error);
  }
};

//點開案件頁面
const viewCase = (caseId) => {
  window.open(`/pet/rescueCase/${caseId}`, "_blank");
};

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

//監聽用戶傳來搜尋條件searchParams的變化，更新案件數據(包含排序順和篩選條件)
watch(
  () => props.searchParams,
  async (newParams) => {
    if (Object.keys(newParams).length === 0) return;

    isLoading.value = true;

    // 轉換 Vue Proxy 物件為普通 JS 物件(Vue 的 ref() 和 reactive() 內部使用 Proxy 來管理響應式數據，包含一些 Vue 內部的 metadata，不是普通的 JS 物件)
    //先用JSON.stringify()去除Vue Proxy的metadata，並返回乾淨的 JSON 字串
    //JSON.parse()將JSON字串轉換為JS物件
    const cleanedParams = JSON.parse(JSON.stringify(newParams));

    console.log("🔹 原始 Proxy 物件:", newParams);
    console.log("✅ 轉換後的普通物件:", cleanedParams);

    try {
      const response = await axiosapi2.post(
        `/RescueCase/search/infinite`,
        cleanedParams.searchParams,
        {
          params: {
            offset: 0,
            limit: 10,
            sortOrder: cleanedParams.sortOrder || "desc",
          },
        }
      );

      console.log("條件篩選後由後端返回數據：", response.data.cases); // 調試數據結構
      // 重新填充新數據
      rescueCaseList.value = response.data.cases;
      offset.value += response.data.cases.length; // 更新 offset
      hasMore.value = response.data.cases.length === limit; // 是否還有更多數據

      cases.value = response.data;
    } catch (error) {
      console.error("搜尋失敗：", error);
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true }
);

const handleScroll = () => {
  // 取得視窗滾動高度 & 總文檔高度
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= fullHeight - 10) {
    // 當網頁滾到底部時，請求更多數據
    fetchCases();
  }
};

// 初始化數據加載
onMounted(() => {
  fetchCases();
  window.addEventListener("scroll", handleScroll); // 監聽整個頁面的滾動
});
</script>

<style scoped>
.case-list {
  padding: px;
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
