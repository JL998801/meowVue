<template>
  <div class="search-form">
    <form @submit.prevent="onSearch">
      <div class="filter-group">
        <input
          type="text"
          v-model="keyword"
          placeholder="關鍵字"
          class="input-field"
        />
        <select v-model="caseStateId" class="dropdown">
          <option value="">案件狀態</option>
          <option
            v-for="state in filteredCaseStates"
            :key="state.caseStateId"
            :value="state.caseStateId"
          >
            {{ state.caseStatement }}
          </option>
        </select>
      </div>
      <div class="filter-group species">
        <label
          ><input type="checkbox" :value="1" @change="toggleSpecies(1)" />
          狗</label
        >
        <label
          ><input type="checkbox" :value="2" @change="toggleSpecies(2)" />
          貓</label
        >
        <label
          ><input type="checkbox" :value="true" @change="updateSuspLost" />
          走失標記</label
        >
      </div>

      <div class="actions">
        <button type="reset" @click="resetForm" class="btn">重設</button>
        <button type="submit" class="btn btn-primary">搜尋</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const emit = defineEmits(["search"]);

const keyword = ref("");
const furColorId = ref("");
const caseStateId = ref("");
const cityId = ref("");
const districtId = ref("");
const selectedSpecies = ref([]);
const suspLost = ref(false);
const selectedBreed = ref("");

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

const fetchFurColors = async () => {
  try {
    const response = await axios.get(`${baseUrl}/pet/allFurColor`);
    furColors.value = response.data;
  } catch (error) {
    console.error("無法獲取毛色資料:", error);
  }
};

const fetchCities = async () => {
  try {
    const response = await axios.get(`${baseUrl}/pet/allCity`);
    cities.value = response.data;
  } catch (error) {
    console.error("無法獲取縣市資料:", error);
  }
};

const fetchDistricts = async (selectedCityId) => {
  if (!selectedCityId) {
    districts.value = [];
    return;
  }
  try {
    const response = await axios.get(
      `${baseUrl}/pet/districtAreasByCity/${selectedCityId}`
    );
    districts.value = response.data;
  } catch (error) {
    console.error("無法獲取鄉鎮區資料:", error);
  }
};

watch(cityId, (newCityId) => {
  fetchDistricts(newCityId);
});

const fetchBreeds = async () => {
  try {
    const response = await axios.get(`${baseUrl}/pet/allBreed`);
    breeds.value = response.data;
  } catch (error) {
    console.error("無法獲取品種資料:", error);
  }
};

const fetchCaseStates = async () => {
  try {
    const response = await axios.get(`${baseUrl}/pet/allCaseState`);
    caseStates.value = response.data;
  } catch (error) {
    console.error("無法獲取救援狀態資料:", error);
  }
};

const filteredCaseStates = computed(() => {
  return caseStates.value.filter((state) =>
    [3, 4, 7, 8].includes(state.caseStateId)
  );
});

const toggleSpecies = (value) => {
  const index = selectedSpecies.value.indexOf(value);
  if (index === -1) {
    selectedSpecies.value.push(value);
  } else {
    selectedSpecies.value.splice(index, 1);
  }
};

const updateSuspLost = (event) => {
  suspLost.value = event.target.checked;
};

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
  emit("search", searchParams);
};

const resetForm = () => {
  keyword.value = "";
  furColorId.value = "";
  caseStateId.value = "";
  cityId.value = "";
  districtId.value = "";
  selectedSpecies.value = [];
  suspLost.value = false;

  emit("search", {
    keyword: "",
    furColorId: "",
    caseStateId: "",
    cityId: "",
    districtAreaId: "",
    speciesId: [],
    suspLost: false,
    breedId: "",
  });
};
</script>

<style scoped>
.search-form {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-bottom: 15px;
}

.filter-group {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.input-field,
.dropdown {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.species label {
  margin-right: 15px;
  font-size: 18px;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: white;
  cursor: pointer;
}

.btn:hover {
  background-color: #e0e0e0;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
