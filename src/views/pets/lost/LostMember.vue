<template>
  <div class="rescue-management-container">
    <main class="content">
      <h2>遺失協尋管理</h2>
      <div class="section-indicator">
        <span
          v-for="(dot, index) in 3"
          :key="index"
          class="dot"
          :class="{ active: index === 0 }"
        ></span>
      </div>

      <div class="lost-header">
        <font-awesome-icon icon="paw" />
        <span>我的協尋記錄</span>
        <Router-link to="/pets/lostform">
          <button class="add-button">+ 新增</button>
        </Router-link>
      </div>

      <!-- 載入中 -->
      <div v-if="isLoading" class="loading">載入中...</div>

      <!-- 若沒有案件 -->
      <div v-else-if="losts.length === 0" class="no-records">查無紀錄。</div>

      <!-- 遺失案件列表 -->
      <div v-else class="lost-list">
        <div
          v-for="lost in losts"
          :key="lost.lostCaseId"
          class="lost-card"
          @click="confirmPetFound(lost)"
        >
          <h3>{{ lost.caseTitle }}</h3>
          <p class="lost-id">
            案件編號：<span class="highlight">{{ lost.lostCaseId }}</span>
          </p>
          <div class="lost-status">
            案件狀態：
            <span
              class="status"
              :class="getStatusClass(lost.caseState?.caseStateId)"
            >
              {{ lost.caseState?.caseStatement || "未知狀態" }}
            </span>
          </div>
          <p>最後更新日期：{{ formatDate(lost.lastUpdateTime) }}</p>
          <p>建立日期：{{ formatDate(lost.publicationTime) }}</p>
        </div>
      </div>

      <!-- 分頁按鈕 -->
      <div class="pagination">
        <button
          class="page-btn"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          &lt; 上一頁
        </button>
        <span class="current-page">{{ currentPage }}</span>
        <button
          class="page-btn"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
        >
          下一頁 &gt;
        </button>
      </div>
    </main>

    <aside>
      <SidebarMenu />
    </aside>
  </div>
</template>

<script setup>
import { onMounted, computed, watch } from "vue";
import Swal from "sweetalert2";
import useLostCases from "@/components/pet/lost/useLostCases.js";
import SidebarMenu from "@/components/SidebarMenu.vue";
import useUserStore from "@/stores/user.js"; // 獲取會員資訊

const userStore = useUserStore();

// **🛠 Debug: 取得會員 ID**
const memberId = computed(() => {
  console.log("🐛 Debug - 取得的 memberId:", userStore.memberId);
  return userStore.memberId ? Number(userStore.memberId) : null;
});

// 🔥 確保 useLostCases 在 memberId 獲取後再初始化
const {
  losts,
  currentPage,
  totalPages,
  fetchLostCases,
  goToPage,
  updateLostCase,
  isLoading,
} = useLostCases(memberId);

// **🛠 Debug: 監聽 losts 是否有變化**
watch(losts, (newLosts) => {
  console.log("🐛 Debug - losts 資料變更:", newLosts);
});

// **🛠 Debug: 監聽 memberId**
watch(memberId, (newId) => {
  console.log("🐛 Debug - memberId 變更:", newId);
  if (newId) {
    fetchLostCases();
  }
});

// 🚀 Vue onMounted 生命週期內部再調用 fetchLostCases()
onMounted(() => {
  console.log("📌 Debug - onMounted 執行，當前 memberId:", memberId.value);
  if (memberId.value) fetchLostCases();
});

// // **案件狀態對應文字**
// const getStatusText = (caseStateId) => {
//     return caseStateId === 5 ? "待協尋" : caseStateId === 6 ? "已尋獲" : "未知狀態";
// };

// **狀態樣式**
const getStatusClass = (caseStateId) => {
  return caseStateId === 5
    ? "status-pending"
    : caseStateId === 6
    ? "status-found"
    : "";
};

// **日期格式化**
const formatDate = (dateString) => {
  if (!dateString) return "無";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// **點擊案件後 SweetAlert 更新案件狀態**
const confirmPetFound = async (lost) => {
  const result = await Swal.fire({
    title: "你家的寵物找到了嗎？",
    text: "如果已找到，請更新案件狀態",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "是，我找到了！",
    cancelButtonText: "取消",
  });

  if (result.isConfirmed) {
    try {
      console.log("🐛 Debug - 正在更新案件狀態:", lost.lostCaseId);
      await updateLostCase(lost.lostCaseId, { caseStateId: 6 });
      Swal.fire("更新成功", "案件狀態已更改為『已尋獲』", "success");
      fetchLostCases();
    } catch (error) {
      console.error("❌ 更新案件狀態失敗:", error);
      Swal.fire("錯誤", "更新案件狀態失敗，請稍後重試", "error");
    }
  }
};
</script>

<style scoped>
.lost-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  /* border: 2px solid red; ✅ Debug */
}

.lost-card {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.lost-card:hover {
  transform: scale(1.02);
}

.lost-id,
.lost-status {
  font-size: 14px;
  color: #555;
}

.highlight {
  color: #28a745;
  font-weight: bold;
}

/* 狀態樣式 */
.status {
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  font-size: 14px;
}

.status-pending {
  background: #dc3545;
} /* 待協尋 */

.status-found {
  background: #28a745;
} /* 已尋獲 */

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
}

.page-btn {
  background-color: #c6bc77;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
}

.page-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.current-page {
  font-size: 16px;
  font-weight: bold;
  padding: 6px 10px;
  background: #28a745;
  color: white;
  border-radius: 5px;
}

.no-records {
  text-align: center;
  font-size: 16px;
  color: #666;
  margin-top: 20px;
}

.loading {
  text-align: center;
  font-size: 16px;
  color: #888;
  margin-top: 20px;
}
</style>
