<!--  案件主組件
        1. 管理案件數據的狀態。
        2. 監聽滾動事件。
        3. 請求數據並將其傳遞給 CaseItem 組件進行渲染
        4. 接收由searchForm傳遞到父組件，再傳遞過來的條件參數，向後端請求數據 -->

<template>
  <div class="case-list" @scroll="handleScroll" ref="scrollContainer">
    <!-- 遍歷案件數據，使用 CaseItem 組件渲染每一個案件 -->
    <CaseItem
      v-for="caseItem in rescueCaseList"
      :key="caseItem.rescueCaseId"
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

//從父組件rescueSearch傳遞的搜尋條件
const props = defineProps({
  searchParams: Object,
});

// 響應式數據
const rescueCaseList = ref([]); // 案件數據
const offset = ref(0); // 當前偏移量
const limit = 10; // 每次請求數據量
const isLoading = ref(false); // 加載狀態
const hasMore = ref(true); // 是否還有更多數據
const scrollContainer = ref(null); // 滾動容器引用
const cases = ref([]);

// 初始化數據加載
onMounted(() => {
  fetchCases();
  window.addEventListener("scroll", handleScroll); // 監聽整個頁面的滾動
});

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

// 監聽用戶傳來搜尋條件searchParams的變化，更新案件數據(包含排序順和篩選條件)
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
