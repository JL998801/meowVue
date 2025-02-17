<template>
  <div class="rescue-page">
    <NewCaseTitle></NewCaseTitle>
    <div class="second-container">
      <div class="main-content">
        <NewCaseForm></NewCaseForm>
      </div>
      <div class="sidebar">
        <div class="advertisement">
          <p>工商</p>
          <!-- <img src="@" alt="廣告圖片" /> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import NewCaseTitle from "@/components/pet/rescue/newCase/NewCaseTitle.vue";
import NewCaseForm from "@/components/pet/rescue/newCase/NewCaseForm.vue";
</script>

<style scoped>
.rescue-page {
  margin: 0 auto;
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
  background-color: #c6bc77;
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
  gap: 40px; /* 兩個元素之間的間距 */
}
</style>
