<template lang="">
  <div class="rescue-page">
    <SearchTitle></SearchTitle>
    <div class="second-container">
      <div class="main-content">
        <SearchForm @search="handleSearch"></SearchForm>
        <div class="sort-buttons-container">
          <div class="sort-buttons">
          <button
          class="sort-button"
          :class="{ active: sortOrder === 'desc' }"
          @click="updateSortOrder('desc')"
        >
        <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide" class="arrow-icon-wide"/>新到舊
        </button>
        <button
          class="sort-button"
          :class="{ active: sortOrder === 'asc' }"
          @click="updateSortOrder('asc')"
        ><font-awesome-icon icon="fa-solid fa-arrow-down-wide-short" />
          舊到新
        </button>
        </div>
      </div>
        <CaseList :searchParams="searchParamsWithSort"> </CaseList>
      </div>
      <div class="sidebar">
        <div class="support-button">
          <RouterLink to="/pet/rescue/add" class="button-link">
            新增救援資訊
          </RouterLink>
        </div>
        <div class="advertisement">
          <p>工商</p>
          <!-- <img src="@" alt="廣告圖片" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref , computed} from "vue";
import SearchTitle from "@/components/pet/rescue/search/SearchTitle.vue";
import SearchForm from "@/components/pet/rescue/search/SearchForm.vue";
import CaseList from "@/components/pet/rescue/search/CaseList.vue";

// 搜尋參數
const searchParams = ref({}); 

// 排序默認為新到舊
const sortOrder = ref("desc"); 


// 接收搜尋條件
const handleSearch = (params) => {
  searchParams.value = params;
  console.log("父組件rescueSearch接收到的搜尋參數：", searchParams.value);
};

// 更新排序條件
const updateSortOrder = (order) => {
  sortOrder.value = order;
};

// 合併搜尋條件與排序條件
const searchParamsWithSort = computed(() => ({
  searchParams: searchParams.value,
  sortOrder: sortOrder.value,
}));

</script>

<style>
.rescue-page {
  margin: 35px auto;
  max-width: 1200px;
}

.sidebar {
  flex: 1 1 20%;
  max-width: 100%;
  margin-top: 30px;
  margin-left: 80px;
  text-align: center;
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 元素居中對齊 */
  display: flex; /* 使用 Flexbox */
}

.sidebar .support-button {
  margin-bottom: 40px;
  width: 200px;
}

.button-link {
  display: inline-block;
  font-weight: 500;
  letter-spacing: 2px; /* 增加字元之間的距離 */
  background-color: #dbb44f;
  color: white;
  padding: 10px 20px;
  font-size: 20px;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 100px;
  width: 200px;
  box-shadow: 0px 2px 2px #6a6a6a;
  line-height: 100px; /* 讓文字垂直置中 */
}

.button-link:hover {
  background-color: #aca269;
}

.advertisement {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  width: 70%;
}

.advertisement img {
  max-width: 100%;
  border-radius: 5px;
}

.second-container {
  display: flex;
  flex-direction: row; /* 水平排列 */
  justify-content: space-between; /* 左右分佈 */
  align-items: flex-start; /* 元素頂部對齊 */
}

.main-content {
  flex: 18; /* 主內容區域占 3 倍空間 */
  display: flex;
  flex-direction: column; /* 垂直排列 SearchForm 和 CaseList */
}

.sort-buttons-container {
  display: flex;
  justify-content: flex-end; /* 按鈕貼容器右側 */
  margin-top: 20px;
  border-bottom: #6a6b6b 2px solid;
}


.sort-buttons {
  display: flex;
  gap: 5px; /* 按鈕間距 */
}

.sort-button {
  margin: 0 10px;
  width: 120px;
  padding: 6px 7px;
  border-radius: 5px 5px 0 0;
  background-color: #f8f8f8;
  letter-spacing: 1.5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sort-button.active {
  background-color: #6a6b6b;
  color: white;
}

.sort-button:hover {
  background-color: #ffd66f;
}

.arrow-icon-wide{
  margin-right: 10px;
}

</style>
