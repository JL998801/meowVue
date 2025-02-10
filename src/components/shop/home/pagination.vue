<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  currentPage: Number,  // 當前頁碼
  totalPages: Number,   // 總頁數
});

const emit = defineEmits(["update-page"]);

// ✅ 計算分頁按鈕列表（最多顯示 5 個頁碼，確保體驗良好）
const pages = computed(() => {
  let startPage = Math.max(1, props.currentPage - 2);
  let endPage = Math.min(props.totalPages, startPage + 4);

  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

// ✅ 切換頁面
const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("update-page", page);
  }
};
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="商品分頁">
    <ul class="pagination">
      <!-- 🔹 上一頁 -->
      <li class="page-item" :class="{ disabled: currentPage === 1 }">
        <button class="page-link" @click="changePage(currentPage - 1)">上一頁</button>
      </li>

      <!-- 🔹 動態生成頁碼 -->
      <li v-for="page in pages" :key="page" class="page-item" :class="{ active: page === currentPage }">
        <button class="page-link" @click="changePage(page)">{{ page }}</button>
      </li>

      <!-- 🔹 下一頁 -->
      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
        <button class="page-link" @click="changePage(currentPage + 1)">下一頁</button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.page-item.active .page-link {
  background-color: #007bff;
  color: white;
}
.page-item .page-link {
  cursor: pointer;
}
</style>
