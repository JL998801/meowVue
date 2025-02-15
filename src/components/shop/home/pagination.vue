<script setup>
import { defineProps, computed } from "vue";
import useProductStore from "@/stores/productStore";

const props = defineProps({
  loading: Boolean,    // 是否正在加載
});

const productStore = useProductStore();

// ✅ 計算可見的頁碼 (最多 5 頁)
const visiblePages = computed(() => {
  const currentPage = productStore.currentPage;
  const totalPages = productStore.totalPages;
  const pages = [];

  // 計算開始與結束頁碼
  let startPage = Math.max(0, currentPage - 2); // 左邊最多 2 頁
  let endPage = Math.min(totalPages - 1, startPage + 4); // 右邊最多 2 頁
  
  // 如果右邊不足 2 頁，則向左補足
  startPage = Math.max(0, endPage - 4);

  // 產生分頁按鈕
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
});

// ✅ 更新頁面
const updatePage = (page) => {
  if (page >= 0 && page < productStore.totalPages) {
    productStore.fetchPagedProducts(page);
  }
};

</script>

<template>
  <div class="pagination">
    <nav v-if="productStore.totalPages" aria-label="商品分頁">
      <ul class="pagination">
        
        <!-- 上一頁按鈕 -->
        <li class="page-item" :class="{ disabled: productStore.currentPage === 0 }">
          <a class="page-link" href="#" @click.prevent="updatePage(productStore.currentPage - 1)" aria-label="上一頁">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        <!-- 產生分頁按鈕 (最多顯示 5 頁) -->
        <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === productStore.currentPage }">
          <a class="page-link" href="#" @click.prevent="updatePage(page)">{{ page + 1 }}</a>
        </li>

        <!-- 下一頁按鈕 -->
        <li class="page-item" :class="{ disabled: productStore.currentPage === productStore.totalPages - 1 }">
          <a class="page-link" href="#" @click.prevent="updatePage(productStore.currentPage + 1)" aria-label="下一頁">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      
      </ul>
    </nav>
  </div>
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

.pagination {
  display: flex;
  list-style: none;
  padding: 0;
}

.page-item {
  margin: 0 5px;
}

.page-link {
  padding: 8px 12px;
  text-decoration: none;
  border: 1px solid #ddd;
  color: #007bff;
  border-radius: 5px;
}

.page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.5;
}

.page-item.active .page-link {
  background-color: #007bff;
  color: white;
}
</style>
