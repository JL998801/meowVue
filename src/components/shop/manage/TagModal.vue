<template>
  <div>
    <!-- ✅ 觸發 Modal -->
    <button class="btn btn-outline-primary" @click="showModal = true">
      選擇標籤
    </button>

    <!-- ✅ Bootstrap Modal -->
    <div v-if="showModal" class="modal d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">選擇標籤</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <div v-for="tag in tagStore.tags" :key="tag.tagId" class="form-check">
              <input
                type="checkbox"
                class="form-check-input"
                :id="'tag_' + tag.tagId"
                :value="tag.tagId"
                v-model="tagStore.selectedTags"
              />
              <label class="form-check-label" :for="'tag_' + tag.tagId">
                {{ tag.tagName }}
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="showModal = false">取消</button>
            <button class="btn btn-primary" @click="confirmSelection">確認</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 選擇的標籤顯示 -->
    <div class="mt-2">
      <span v-for="tagId in tagStore.selectedTags" :key="tagId" class="badge bg-primary me-1">
        {{ getTagName(tagId) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import useProductTagStore from "@/stores/productTagStore";
import useProductStore from "@/stores/productStore";

const showModal = ref(false);
const tagStore = useProductTagStore();
const productStore = useProductStore();

const productId = ref(null); // 儲存當前選擇的商品 ID

// **直接從 store 取得 selectedTags**
const selectedTags = ref([]);

// ✅ 打開標籤選擇 Modal，並載入對應的標籤
const openModal = (product) => {
  productId.value = product.productId;
  selectedTags.value = productStore.selectedTags[productId.value] || [];
  showModal.value = true;
};

// ✅ 確認選擇標籤，直接更新 store
const confirmSelection = () => {
  productStore.selectedTags[productId.value] = selectedTags.value;
  showModal.value = false;
};

// ✅ 取得標籤名稱
const getTagName = (tagId) => {
  return tagStore.tags.find(tag => tag.tagId === tagId)?.tagName || "";
};
</script>

<style scoped>
/* ✅ 讓 Modal 懸浮於視窗最上層 */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1050;
  background: rgba(0, 0, 0, 0.5);
}

/* ✅ 調整 Modal 尺寸 */
.modal-dialog {
  max-width: 400px;
}

.modal-body {
  max-height: 300px;
  overflow-y: auto; /* ✅ 若標籤過多允許滾動 */
}
</style>
