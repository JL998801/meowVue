<template>
  <div class="admin-case-management">
    <h2>案件管理</h2>

    <!-- 篩選條件表單 -->
    <SearchForm @search="handleSearch" />
    <div class="sort-buttons-container">
      <div class="sort-buttons">
        <button
          class="sort-button"
          :class="{ active: sortOrder === 'desc' }"
          @click="updateSortOrder('desc')"
        >
          <font-awesome-icon
            icon="fa-solid fa-arrow-down-short-wide"
            class="arrow-icon-wide"
          />新到舊
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

    <!-- 案件列表 -->
    <CaseList :searchParams="searchParamsWithSort" @deleteCase="deleteCase" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { axiosapi2 } from "@/plugins/axios.js";
import SearchForm from "@/components/admin/rescueManagement/SearchForm.vue";
import CaseList from "@/components/admin/rescueManagement/CaseList.vue";
import Swal from "sweetalert2";

//此為案件條件表單和caseList的父組件

// 搜尋參數
const searchParams = ref({});

const cases = ref([]);
const userToken = ref(""); // 用戶的 Token

// 初始化獲取所有案件
const fetchAllCases = async () => {
  try {
    const response = await axiosapi2.get("/RescueCase/search/allCases", {
      params: { offset: 0, limit: 20, sortOrder: "desc" },
    });
    cases.value = response.data.cases;
  } catch (error) {
    console.error("獲取案件失敗:", error);
  }
};

// 接收搜尋條件
const handleSearch = (params) => {
  searchParams.value = params;
  console.log("父組件rescueSearch接收到的搜尋參數：", searchParams.value);
};

// 排序默認為新到舊
const sortOrder = ref("desc");

// 刪除案件
const deleteCase = async (caseId) => {
  try {
    // 顯示 SweetAlert 確認對話框
    const result = await Swal.fire({
      title: "確定要刪除此案件嗎？",
      text: "此操作不可恢復！",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "刪除",
      cancelButtonText: "取消",
    });

    // 如果使用者按下確認刪除
    if (result.isConfirmed) {
      const user = localStorage.getItem("user");
      const parsedUser = JSON.parse(user);
      const userToken = parsedUser?.token;
      console.log;

      if (!userToken) {
        Swal.fire("錯誤", "無法取得授權 Token，請重新登入", "error");
        return;
      }

      await axiosapi2.delete(`/RescueCase/delete/${caseId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // 更新案件列表
      cases.value = cases.value.filter((c) => c.rescueCaseId !== caseId);

      // 顯示成功訊息
      Swal.fire("已刪除！", "案件已成功刪除。", "success");
    }
  } catch (error) {
    console.error("刪除案件失敗:", error);
    Swal.fire("錯誤", "刪除案件失敗，請稍後再試。", "error");
  }
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

onMounted(fetchAllCases);
</script>

<style scoped>
.map-container {
  height: 400px;
  margin-top: 20px;
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

.arrow-icon-wide {
  margin-right: 10px;
}
</style>
