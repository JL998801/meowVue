<template>
  <div class="case-list" @scroll="handleScroll" ref="scrollContainer">
    <!-- 遍歷案件數據，使用 CaseItem 組件渲染每一個案件 -->
    <CaseItem
      v-for="caseItem in lostCaseList"
      :key="caseItem.lostCaseId"
      :caseItem="caseItem"
    />
    <!-- 加載提示 -->
    <div v-if="isLoading" class="loading">加載中...</div>
    <div v-else-if="!hasMore" class="no-more">沒有更多數據</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { axiosapi2 } from "@/plugins/axios.js";
import CaseItem from "./CaseItem.vue";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// **從 `LostSearch.vue` 傳入的 `searchParams`**
const props = defineProps({
  searchParams: Object,
});

// 響應式數據
const lostCaseList = ref([]); // 案件數據
const offset = ref(0); // 當前偏移量
const limit = 10; // 每次請求數據量
const isLoading = ref(false); // 加載狀態
const hasMore = ref(true); // 是否還有更多數據
const scrollContainer = ref(null); // 滾動容器引用
const cases = ref([]);

// ✅ **確保 `searchParams` 正確傳遞**
console.log("🔍 發送請求的 searchParams:", props.searchParams);

// **初始化數據加載**
onMounted(() => {
  fetchCases();
  window.addEventListener("scroll", handleScroll); // 監聽整個頁面的滾動
});

// **獲取案件數據**
const fetchCases = async () => {
  if (isLoading.value || !hasMore.value) return;

  isLoading.value = true;
  try {
    const response = await axiosapi2.post(
      "/lostcases/search",
      props.searchParams,
      {
        params: {
          offset: offset.value,
          limit: limit,
          sortOrder: props.searchParams?.sortOrder || "desc",
        },
      }
    );

    console.log("🔹 API 回應內容:", response.data);

    // ✅ 確保 `content` 存在
    if (!response.data || !Array.isArray(response.data.content)) {
      console.error("❌ API 回應錯誤，content 不存在或不是陣列:", response.data);
      return;
    }

    lostCaseList.value = response.data.content; // ✅ 修正 `cases` 為 `content`
    offset.value += response.data.content.length;
    hasMore.value = response.data.content.length === limit;

  } catch (error) {
    console.error("❌ 加載案件數據失敗:", error.response?.data || error);
  } finally {
    isLoading.value = false;
  }
};

// **滾動監聽**
const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= fullHeight - 10) {
    fetchCases();
  }
};

// **監聽 `searchParams` 變化**
watch(
  () => props.searchParams,
  async (newParams, oldParams) => {
    console.log("🔄 `searchParams` 變更，重新請求數據:", newParams);

    if (JSON.stringify(newParams) === JSON.stringify(oldParams)) {
      return;
    }

    isLoading.value = true;
    try {
      const response = await axiosapi2.post(
        "/lostcases/search",
        newParams,
        {
          params: {
            offset: 0,
            limit: 10,
            sortOrder: newParams.sortOrder || "desc",
          },
        }
      );

      console.log("條件篩選後由後端返回數據：", response.data.content);
      lostCaseList.value = response.data.content;
      offset.value = response.data.content.length;
      hasMore.value = response.data.content.length === limit;

    } catch (error) {
      console.error("搜尋失敗：", error);
    } finally {
      isLoading.value = false;
    }
  },
  { deep: true, immediate: true } // ✅ `deep: true` 讓 Vue 監聽物件內部變化
);
</script>


<style scoped>
.case-list {
  /* height: 500px; */
  overflow-y: auto;
  /* border: 1px solid #ddd; */
  padding: 20px;
}

.loading,
.no-more {
  text-align: center;
  margin-top: 10px;
}
</style>
