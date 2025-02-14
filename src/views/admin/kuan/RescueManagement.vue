<template>
  <div class="admin-case-management">
    <h2>案件管理</h2>

    <!-- 篩選條件表單 -->
    <SearchForm @filterCases="fetchFilteredCases" />

    <!-- Google 地圖呈現案件位置 -->
    <!-- <div class="map-container">
      <GoogleMap :locations="caseLocations" />
    </div> -->

    <!-- 案件列表 -->
    <CaseList :cases="cases" @deleteCase="deleteCase" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import SearchForm from "@/components/admin/rescueManagement/SearchForm.vue";
import CaseList from "@/components/admin/rescueManagement/CaseList.vue";
// import GoogleMap from "@/views/pages/pet/map/GoogleMap.vue";

const cases = ref([]); // 儲存案件列表
const caseLocations = ref([]); // 儲存案件座標資訊

// 初始化獲取所有案件
const fetchAllCases = async () => {
  try {
    const response = await axios.get("/RescueCase/search/allCases", {
      params: { offset: 0, limit: 20, sortOrder: "desc" },
    });
    cases.value = response.data.cases;
  } catch (error) {
    console.error("獲取案件失敗:", error);
  }
};

// 取得篩選後的案件
const fetchFilteredCases = async (filters) => {
  try {
    const response = await axios.post("/RescueCase/search", filters);
    cases.value = response.data;
    fetchCaseLocations(filters);
  } catch (error) {
    console.error("篩選案件失敗:", error);
  }
};

// 取得篩選後的案件座標
const fetchCaseLocations = async (filters) => {
  try {
    const response = await axios.get("/RescueCase/getLocations/filters", {
      params: filters,
    });
    caseLocations.value = response.data;
  } catch (error) {
    console.error("獲取案件座標失敗:", error);
  }
};

// 刪除案件
const deleteCase = async (caseId) => {
  try {
    await axios.delete(`/RescueCase/delete/${caseId}`);
    cases.value = cases.value.filter((c) => c.rescueCaseId !== caseId);
  } catch (error) {
    console.error("刪除案件失敗:", error);
  }
};

onMounted(fetchAllCases);
</script>

<style scoped>
.admin-case-management {
  padding: 20px;
}
.map-container {
  height: 400px;
  margin-top: 20px;
}
</style>
