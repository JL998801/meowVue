<template lang="">
  <div class="search-form">
    <form @submit.prevent="onSearch">
      <div class="input-group">
        <input
          class="input-field"
          type="text"
          v-model="keyword"
          placeholder="請輸入關鍵字"
        />
      </div>
      <div class="filters">
        <input
          type="text"
          v-model="selectedBreed"
          list="breedOptions"
          placeholder="請輸入或選擇品種"
          class="input-field"
        />
        <datalist id="breedOptions">
          <option
            v-for="breed in breeds"
            :key="breed.breedId"
            :value="breed.breed"
          >
            {{ breed.breed }}
          </option>
        </datalist>
      </div>
      <div class="filters">
        <select v-model="furColorId" class="dropdown">
          <option value="">選擇毛色</option>
          <option
            v-for="color in furColors"
            :key="color.furColorId"
            :value="color.furColorId"
          >
            {{ color.furColor }}
          </option>
        </select>
        <select v-model="caseStateId" class="dropdown">
          <option value="">選擇救援狀態</option>
          <option
            v-for="state in filteredCaseStates"
            :key="state.caseStateId"
            :value="state.caseStateId"
          >
            {{ state.caseStatement }}
          </option>
        </select>
        <select v-model="cityId" class="dropdown">
          <option value="">縣市</option>
          <option
            v-for="city in cities"
            :key="city.cityId"
            :value="city.cityId"
          >
            {{ city.city }}
          </option>
        </select>
        <select v-model="districtId" class="dropdown" :disabled="!cityId">
          <option value="">鄉鎮區</option>
          <option
            v-for="dist in districts"
            :key="dist.districtAreaId"
            :value="dist.districtAreaId"
          >
            {{ dist.districtAreaName }}
          </option>
        </select>
      </div>
      <div class="species">
        <label>
          <input
            type="checkbox"
            :value="1"
            :checked="selectedSpecies.includes(1)"
            @change="toggleSpecies(1)"
          />
          狗
        </label>
        <label>
          <input
            type="checkbox"
            :value="2"
            :checked="selectedSpecies.includes(2)"
            @change="toggleSpecies(2)"
          />
          貓
        </label>
        <label>
          <input type="checkbox" :value="true" @change="updateSuspLost" />
          走失標記 <span class="optional">(如果浪浪疑似走失，請勾選)</span>
        </label>
      </div>
      <p class="tip">
        <strong class="tip-highlight">小提醒：</strong>
        如果找不到想要的案件，可以先
        <span class="highlight">不要填寫</span
        >「縣市鄉鎮區」欄位，這樣可以擴大搜尋範圍喔！
      </p>
      <div class="actions">
        <button type="reset" @click="resetForm" class="btn-reset">重設</button>
        <button type="submit" class="btn-search">確定搜尋</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { axiosapi2 } from "@/plugins/axios.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// 定義 emit 事件
const emit = defineEmits(["search"]);

//往後端送的搜尋條件
const keyword = ref("");
const furColorId = ref("");
const caseStateId = ref("");
const cityId = ref("");
const districtId = ref("");
const selectedSpecies = ref([]); // 儲存選中的物種 ID
const suspLost = ref(false);
const selectedBreed = ref("");

//提取對應表資料
const furColors = ref([]);
const cities = ref([]);
const districts = ref([]);
const breeds = ref([]);
const caseStates = ref([]);

onMounted(() => {
  fetchFurColors();
  fetchCaseStates();
  fetchCities();
  fetchBreeds();
});

//提取毛色資料
const fetchFurColors = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allFurColor`);
    furColors.value = response.data;
    console.log("毛色資料1:", furColors.value);
    console.log("毛色資料2:", furColors.value[0].furColor);
  } catch (error) {
    console.error("無法獲取毛色資料:", error);
  }
};

//提取縣市資料
const fetchCities = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allCity`);
    cities.value = response.data;
  } catch (error) {
    console.error("無法獲取縣市資料:", error);
  }
};

//藉由縣市id提取鄉鎮區資料
// 獲取對應縣市的鄉鎮區
const fetchDistricts = async (selectedCityId) => {
  if (!selectedCityId) {
    districts.value = []; // 清空鄉鎮區
    return;
  }
  try {
    const response = await axiosapi2.get(
      `/pet/districtAreasByCity/${selectedCityId}`
    );
    districts.value = response.data;
  } catch (error) {
    console.error("無法獲取鄉鎮區資料:", error);
  }
};

// 監聽 cityId 的變化，動態加載對應的鄉鎮區
watch(cityId, (newCityId) => {
  fetchDistricts(newCityId);
});

//提取品種資料
const fetchBreeds = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allBreed`);
    breeds.value = response.data;
  } catch (error) {
    console.error("無法獲取品種資料:", error);
  }
};

//提取救援狀態資料並篩選救援所需
const fetchCaseStates = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allCaseState`);
    caseStates.value = response.data;
  } catch (error) {
    console.error("無法獲取救援狀態資料:", error);
  }
};
const filteredCaseStates = computed(() => {
  // 只保留特定索引對應的對象
  const desiredIndices = [3, 4, 7, 8];
  return caseStates.value.filter((state) =>
    desiredIndices.includes(state.caseStateId)
  );
});

// 物種切換選中狀態
const toggleSpecies = (value) => {
  const index = selectedSpecies.value.indexOf(value);
  if (index === -1) {
    selectedSpecies.value.push(value); // 如果未選中，添加到數組
  } else {
    selectedSpecies.value.splice(index, 1); // 如果已選中，從數組中移除
  }
  console.log("選中的物種:", selectedSpecies.value);
};

//走失標記
const updateSuspLost = (event) => {
  if (event.target.checked) {
    suspLost.value = true; // 勾選時設為true
  } else {
    suspLost.value = false; // 取消勾選時設為 0
  }
};

//送出搜尋
const onSearch = () => {
  const searchParams = {
    keyword: keyword.value,
    furColorId: furColorId.value,
    caseStateId: caseStateId.value,
    cityId: cityId.value,
    districtAreaId: districtId.value,
    speciesId: selectedSpecies.value,
    suspLost: suspLost.value,
    breedId: selectedBreed.value,
  };
  console.log("搜尋參數：", searchParams);
  // 傳遞給父組件
  emit("search", searchParams);
};

//重置按鈕
const resetForm = () => {
  keyword.value = "";
  furColorId.value = "";
  caseStateId.value = "";
  cityId.value = "";
  districtId.value = "";
  selectedSpecies.value = [];
  suspLost.value = 0;

  //除了重製搜尋條件外，也讓所有案件重製(變回查詢全部案件)
  const searchParams = {
    keyword: keyword.value,
    furColorId: furColorId.value,
    caseStateId: caseStateId.value,
    cityId: cityId.value,
    districtAreaId: districtId.value,
    speciesId: selectedSpecies.value,
    suspLost: suspLost.value,
    breedId: selectedBreed.value,
  };
  console.log("搜尋參數：", searchParams);
  // 傳遞給父組件
  emit("search", searchParams);
};
</script>

<style scoped>
.search-form {
  /* background-color: #f9f9f9; */
  padding: 0 20px 0 20px;
  border-radius: 8px;
  margin-bottom: 0;
}

.input-group {
  margin-bottom: 10px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e2e5; /* 邊框顏色 */
  border-radius: 5px; /* 圓弧邊角，數值越大圓弧越明顯 */
  font-size: 16px;
  background-color: #e5e2e5; /* 淺灰底色 */
  outline: none; /* 移除點擊後的藍色外框 */
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: space-between; /* 讓元素平均分配空間 */
}

/* 讓所有 select 平均分配寬度 */
.filters select {
  flex: 1; /* 讓每個 <select> 平均填充父容器 */
  min-width: 0; /* 防止過度擠壓 */
}

.dropdown {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #e5e2e5; /* 邊框顏色 */
  border-radius: 5px; /* 圓弧邊角，數值越大圓弧越明顯 */
  font-size: 16px;
  background-color: #e5e2e5; /* 淺灰底色 */
}

.optional {
  font-size: 14px;
  color: #d32f2f;
  font-weight: 500;
}

.species label {
  margin-right: 30px;
  cursor: pointer;
  font-size: 18px;
}

.species input {
  margin-right: 5px;
}

.tip {
  font-size: 18px;
  color: #262626;
  background-color: #fcf4df;
  padding: 10px;
  /* border: 1px solid #ffe0b2; */
  border-radius: 4px;
  margin-top: 10px;
}

.tip-highlight {
  color: #d32f2f;
}

.highlight {
  color: #d32f2f;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 10px;
  font-size: 18px;
}

.btn-reset {
  background-color: #fff;
  border: 1px solid #333;
  font-weight: 700;
  width: 70px;
  margin-right: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-reset:hover {
  background-color: #636163;
  color: #fff;
}

.btn-search {
  background-color: #feba07;
  font-weight: 700;
  width: 120px;
  color: #333;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-search:hover {
  background-color: #fadc92;
}
</style>
