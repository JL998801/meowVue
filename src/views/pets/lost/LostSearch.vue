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
          <input type="text" placeholder="請輸入關鍵字" v-model="keyword" />

          <div class="filter-section">
            <input type="number" placeholder="案件編號" v-model="lostCaseId" />

            <select v-model="selectedCaseStatement">
              <option value="" disabled selected>結案狀態</option>
              <option v-for="caseStatement in caseStatements" :key="caseStatement.caseStateId"
                :value="caseStatement.caseStateId">
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
            <label><input type="radio" name="species" value="dog" v-model="filters.species" /> 狗</label>
            <label><input type="radio" name="species" value="cat" v-model="filters.species" /> 貓</label>
            <label><input type="radio" name="gender" value="male" v-model="filters.gender" /> 男</label>
            <label><input type="radio" name="gender" value="female" v-model="filters.gender" /> 女</label>
            <label><input type="checkbox" v-model="filters.earCut" /> 已絕育</label>
            <label><input type="checkbox" v-model="filters.microchip" /> 有晶片</label>
          </div>

          <!-- ✅ 小提醒 -->
          <div class="search-note">
            <span class="highlight">小提醒：</span>如果找不到想要的案件，可以先 <span class="red-text">不要</span> 填寫「縣市鄉鎮區」欄位，這樣可以擴大搜尋範圍喔！
          </div>

          <!-- ✅ 搜尋按鈕 -->
          <div class="button-group">
            <button class="btn btn-reset" @click="reloadPage">重設</button>
            <button type="submit" class="btn btn-confirm">確定搜尋</button>
          </div>
        </div>
      </form>

      <!-- ✅ 新增遺失通報 -->
      <div class="add-report">
        <button class="btn-report">新增遺失通報</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axiosapi from "@/plugins/axios.js";

// **查詢條件**
const keyword = ref(""); // 全域模糊查詢
const lostCaseId = ref(""); // 案件編號
const selectedCaseStatement = ref(""); // 結案狀態
const cityId = ref(""); // 選擇的城市 ID
const district = ref(""); // 選擇的鄉鎮區
const filters = ref({
  species: "", // 狗或貓
  gender: "", // 男或女
  earCut: false, // 已絕育
  microchip: false, // 有晶片
});

// **存放從後端獲取的數據**
const caseStatements = ref([]);
const cities = ref([]);
const districts = ref([]);
const lostCases = ref([]); // 存放查詢結果

// ✅ 取得 **案件狀態**（僅包含 5: 待協尋, 6: 已尋獲）
const fetchCaseStates = async () => {
  try {
    const response = await axiosapi.get("/pet/allCaseState");
    caseStatements.value = response.data.filter(cs => cs.caseStateId === 5 || cs.caseStateId === 6);
    console.log("✅ 案件狀態:", caseStatements.value);
  } catch (error) {
    console.error("❌ 無法取得案件狀態:", error);
  }
};

// ✅ 取得 **縣市**
const fetchCities = async () => {
  try {
    const response = await axiosapi.get("/pet/allCity");
    cities.value = response.data;
    console.log("✅ 城市列表:", cities.value);
  } catch (error) {
    console.error("❌ 無法取得城市資料:", error);
  }
};

// ✅ 根據 **選擇的城市** 取得 **對應的鄉鎮區**
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

// ✅ 當選擇城市時，自動更新鄉鎮區
watch(cityId, fetchDistricts);

// ✅ 重新整理查詢欄（避免空值錯誤）
const reloadPage = () => {
  keyword.value = undefined;
  lostCaseId.value = undefined;
  selectedCaseStatement.value = undefined;
  cityId.value = undefined;
  district.value = undefined;
  filters.value = {
    species: undefined,
    gender: undefined,
    earCut: false,
    microchip: false,
  };

  lostCases.value = []; // 清空搜尋結果

  console.log("🔄 重設查詢條件");

  // ✅ 確保 `searchCases()` 接收到正確的 `undefined` 值
  searchCases();
};

// ✅ 提交查詢請求（修正空值傳遞問題）
const searchCases = async () => {
  const queryParams = {
    keyword: keyword.value || undefined,
    lostCaseId: lostCaseId.value ? Number(lostCaseId.value) : undefined,
    caseStateId: selectedCaseStatement.value || undefined,
    cityId: cityId.value || undefined,
    district: district.value || undefined,
    species: filters.value.species || undefined,
    gender: filters.value.gender || undefined,
    earCut: filters.value.earCut,
    microchip: filters.value.microchip,
    start: 0,  // 預設從第 0 筆開始
    rows: 10,  // 預設每頁 10 筆
    sort: "lostCaseId", // 預設排序欄位
    dir: false, // 預設升序
  };

  // **刪除 undefined 或 null 的 key**
  Object.keys(queryParams).forEach(
    key => (queryParams[key] === undefined || queryParams[key] === "") && delete queryParams[key]
  );

  console.log("🔎 修正後的搜尋條件:", queryParams);

  try {
    const response = await axiosapi.get("/lostcases/search", { params: queryParams });

    if (response.data && response.data.content) {
      lostCases.value = response.data.content;
      console.log("✅ 搜尋結果:", lostCases.value);
    } else {
      lostCases.value = [];
      console.warn("⚠️ 查無案件資料");
    }
  } catch (error) {
    console.error("❌ 查詢失敗:", error);
  }
};


// **頁面載入時執行**
onMounted(() => {
  fetchCaseStates();
  fetchCities();
});

// ✅ **使用 `defineExpose()` 來暴露變數**
defineExpose({
  keyword,
  lostCaseId,
  selectedCaseStatement,
  caseStatements,
  cityId,
  cities,
  district,
  districts,
  filters,
  lostCases, // 新增此變數，讓其他組件可以讀取查詢結果
  fetchDistricts,
  reloadPage,
  searchCases,
});
</script>



<style scoped>
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
  background-color: #28a745;
  color: white;
}

.add-report {
  width: 30%;
  display: flex;
  justify-content: flex-end;
}

.btn-report {
  background-color: #2ecc71;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}
</style>