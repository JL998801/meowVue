<template>
  <div class="lost-search">
    <!-- ✅ Title Section -->
    <div class="title-container">
      <h2>遺失協尋</h2>
      <div class="dots">
        <span class="dot dot-green"></span>
        <span class="dot dot-beige"></span>
        <span class="dot dot-pink"></span>
      </div>
    </div>

    <div class="search-container">
      <!-- ✅ 搜尋表單 -->
      <form @submit.prevent="searchCases">
        <div class="search-inputs">
          <input type="text" v-model="keyword" placeholder="請輸入關鍵字" />

          <div class="filter-section">
            <input type="number" v-model="lostCaseId" placeholder="案件編號" />

            <select v-model="selectedCaseStatement">
              <option value="" disabled selected>結案狀態</option>
              <option v-for="caseStatement in caseStatements" :key="caseStatement.caseStateId" :value="caseStatement.caseStateId">
                {{ caseStatement.caseStatement }}
              </option>
            </select>

            <select v-model="cityId">
              <option value="" disabled selected>縣市</option>
              <option v-for="city in cities" :key="city.cityId" :value="city.cityId">
                {{ city.city }}
              </option>
            </select>

            <select v-model="district">
              <option value="" disabled>鄉鎮區</option>
              <option v-for="dist in districts" :key="dist.districtAreaId" :value="dist.districtAreaId">
                {{ dist.districtAreaName }}
              </option>
            </select>
          </div>

          <!-- ✅ 選擇條件 -->
          <div class="filter-checkboxes">
            <label><input type="radio" name="species" value="1" v-model="filters.species" /> 狗</label>
            <label><input type="radio" name="species" value="2" v-model="filters.species" /> 貓</label>
            <label><input type="radio" name="gender" value="男" v-model="filters.gender" /> 男</label>
            <label><input type="radio" name="gender" value="女" v-model="filters.gender" /> 女</label>
            <label><input type="checkbox" :value="'已絕育'" v-model="filters.sterilization" /> 已絕育</label>
          </div>

          <!-- ✅ 小提醒 -->
          <div class="search-note">
            <span class="highlight">小提醒：</span>如果找不到想要的案件，可以先 <span class="red-text">不要</span> 填寫「縣市鄉鎮區」欄位，這樣可以擴大搜尋範圍喔！
          </div>

          <!-- ✅ 搜尋 & 重設 按鈕 -->
          <div class="button-group">
            <button class="btn btn-reset" @click="reloadPage">重設</button>
            <button class="btn btn-confirm" @click="searchCases">確定搜尋</button>
          </div>
        </div>
      </form>
            <!-- ✅ 新增遺失通報 -->
      <div class="add-report">
        <Router-link to="/pets/lostform">
          <button class="btn-report">新增遺失通報</button>
      </Router-link>
      </div>
            
    </div>
    <!-- ✅ 排序按鈕 -->
      <div class="sort-buttons-container">
        <div class="sort-buttons">
          <button
            class="sort-button"
            :class="{ active: sortOrder === 'desc' }"
            @click="updateSortOrder('desc')"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-down-short-wide" class="arrow-icon-wide" />
            新到舊
          </button>
          <button
            class="sort-button"
            :class="{ active: sortOrder === 'asc' }"
            @click="updateSortOrder('asc')"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-down-wide-short" />
            舊到新
          </button>
        </div>
      </div>
    <!-- ✅ 案件列表 -->
    <CaseList :searchParams="searchParams" />
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, watchEffect } from "vue";
import { axiosapi } from "@/plugins/axios.js";
import CaseList from "@/components/pet/lost/case/CaseList.vue"; // ✅ 引入 CaseList

// **查詢條件**
const keyword = ref(""); // 全域模糊查詢
const lostCaseId = ref(""); // 案件編號查詢
const selectedCaseStatement = ref(""); // 結案狀態
const cityId = ref(""); // 選擇的城市 ID
const district = ref(""); // 選擇的鄉鎮區
const sortOrder = ref("desc"); // ✅ 預設排序為「新到舊」
const filters = ref({
  species: "", // 狗或貓
  gender: "", // 男或女
  sterilization: "", // 已絕育
});

// **存放後端獲取的數據**
const caseStatements = ref([]); // 案件狀態
const cities = ref([]); // 縣市
const districts = ref([]); // 鄉鎮區
const lostCases = ref([]); // 查詢結果

// ✅ **初始化 `searchParams`**
const searchParams = ref({
  keyword: "",
  lostCaseId: "",
  caseStateId: "",
  cityId: "",
  districtAreaId: "",
  speciesId: "",
  gender: "",
  sterilization: "",
  sortOrder: "desc",
});

// ✅ **計算屬性：當 `searchCases()` 更新時，自動變更 `searchParams`**
const computedSearchParams = computed(() => ({
  keyword: keyword.value ? keyword.value.trim() : null, // ✅ `""` 變成 `null`
  lostCaseId: lostCaseId.value, // ✅ 避免 `0`
  caseStateId: selectedCaseStatement.value,
  cityId: cityId.value,
  districtAreaId: district.value,
  speciesId: filters.value.species,
  gender: filters.value.gender,
  sterilization: filters.value.sterilization ? "已絕育" : "",
  sortOrder: sortOrder.value,
}));
watchEffect(() => {
  searchParams.value = computedSearchParams.value;
  console.log("🔄 searchParams 更新:", searchParams.value);
});

// ✅ **更新排序方式**
const updateSortOrder = (order) => {
  if (sortOrder.value === order) return; // ✅ 防止重複點擊觸發請求
  sortOrder.value = order;

  // ✅ 重新更新 `searchParams`，讓 Vue 重新監聽變更
  searchParams.value = {
    ...searchParams.value, // ✅ 保留原本的 `searchParams`
    sortOrder: order, // ✅ 更新排序方式
  };

  console.log("🔄 排序變更，更新 searchParams:", searchParams.value);
};

// ✅ **觸發搜尋**
const searchCases = () => {
  searchParams.value = computedSearchParams.value;
  console.log("🔎 確定搜尋，更新 searchParams:", searchParams.value);
};

// ✅ 取得案件狀態（5: 待協尋, 6: 已尋獲）
const fetchCaseStates = async () => {
  try {
    const response = await axiosapi.get("/pet/allCaseState");
    caseStatements.value = response.data.filter(cs => cs.caseStateId === 5 || cs.caseStateId === 6);
    console.log("✅ 案件狀態:", caseStatements.value);
  } catch (error) {
    console.error("❌ 無法取得案件狀態:", error);
  }
};

// ✅ 取得縣市
const fetchCities = async () => {
  try {
    const response = await axiosapi.get("/pet/allCity");
    cities.value = response.data;
    console.log("✅ 城市列表:", cities.value);
  } catch (error) {
    console.error("❌ 無法取得城市資料:", error);
  }
};

// ✅ 取得鄉鎮區（根據 `cityId`）
const fetchDistricts = async () => {
  if (!cityId.value) {
    districts.value = [];
    return;
  }
  try {
    const response = await axiosapi.get(`/pet/districtAreasByCity/${cityId.value}`);
    districts.value = response.data;
    console.log("✅ 鄉鎮區列表:", districts.value);
  } catch (error) {
    console.error("❌ 無法取得鄉鎮區資料:", error);
  }
};

// ✅ 當 `cityId` 變更時，自動獲取 `districts`
watch(cityId, fetchDistricts);

// ✅ **重設查詢條件**
const reloadPage = () => {
  keyword.value = "";
  lostCaseId.value = "";
  selectedCaseStatement.value = "";
  cityId.value = "";
  district.value = "";
  filters.value = {
    species: "",
    gender: "",
    sterilization: "",
  };

  searchParams.value = { // ✅ **確保 `searchParams` 也會被清空**
    keyword: "",
    lostCaseId: "",
    caseStateId: "",
    cityId: "",
    districtAreaId: "",
    speciesId: "",
    gender: "",
    sterilization: "",
    sortOrder: "desc",
  };

  lostCases.value = []; // ✅ **清空案件列表**
  console.log("🔄 重置查詢條件");
};

// **頁面載入時執行**
onMounted(() => {
  fetchCaseStates();
  fetchCities();
});
</script>

<style scoped>
/* ✅ 排序按鈕樣式 */
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

.lost-search {
  width: 100%;
  max-width: 800px;
  margin: auto;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
  margin-bottom: 20px;
}

.title-container h2 {
  font-size: 24px;
  font-weight: bold;
}

.dots {
  display: flex;
  gap: 5px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-green {
  background-color: #66cdaa;
}

.dot-beige {
  background-color: #f5deb3;
}

.dot-pink {
  background-color: #ffb6c1;
}

.search-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.search-inputs {
  width: 70%;
}

.search-inputs input,
.search-inputs select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.filter-section {
  display: flex;
  gap: 10px;
}

.filter-checkboxes {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.search-note {
  background-color: #fff8e1;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 10px;
}

.highlight {
  font-weight: bold;
}

.red-text {
  color: red;
  font-weight: bold;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn {
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.btn-reset {
  background-color: white;
  border: 1px solid black;
}

.btn-confirm {
  background-color: #ffd66f;
  color: white;
}

.add-report {
  width: 30%;
  display: flex;
  justify-content: flex-end;
}

.btn-report {
  background-color: #c6bc77;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
</style>