<template>
  <div class="search-form">
    <form @submit.prevent="onSearch">
      <div class="filter-group">
        <input
          type="text"
          v-model="caseId"
          placeholder="案件ID"
          class="input-field"
        />
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
import { axiosapi2 } from "@/plugins/axios.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const emit = defineEmits(["search"]);

//傳遞表單數據
const caseId = ref("");
const keyword = ref("");
const caseStateId = ref("");
const selectedSpecies = ref([]); // 儲存選中的物種 ID
const suspLost = ref(false);

// 儲存案件列表

const cases = ref([]);

//拿取下拉選單數據
const caseStates = ref([]);

onMounted(() => {
  fetchCaseStates();
});

const fetchCaseStates = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allCaseState`);
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
    caseId: caseId.value,
    keyword: keyword.value,
    caseStateId: caseStateId.value,
    speciesId: selectedSpecies.value,
    suspLost: suspLost.value,
  };
  console.log("搜尋參數：", searchParams);
  // 傳遞給父組件
  emit("search", searchParams);
};

//重置按鈕
const resetForm = () => {
  caseId.value = "";
  keyword.value = "";
  caseStateId.value = "";
  selectedSpecies.value = [];
  suspLost.value = 0;

  //除了重製搜尋條件外，也讓所有案件重製(變回查詢全部案件)
  const searchParams = {
    caseId: caseId.value,
    keyword: keyword.value,
    caseStateId: caseStateId.value,
    speciesId: selectedSpecies.value,
    suspLost: suspLost.value,
  };
  console.log("搜尋參數：", searchParams);
  // 傳遞給父組件
  emit("search", searchParams);
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
