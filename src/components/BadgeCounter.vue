<script setup>
import { defineProps } from "vue";

const props = defineProps({
  count: Number,  // ✅ 數字 (通知數量)
  modalId: String, // ✅ 點擊後要開啟的 modal ID
  icon: String, // ✅ 按鈕 Icon
  label: String, // ✅ 按鈕名稱
});
</script>

<template>
  <button type="button" class="btn btn-primary position-relative" data-bs-toggle="modal" :data-bs-target="`#${modalId}`">
    <i :class="icon"></i> {{ label }}
    <span v-if="count > 0" class="badge bg-danger position-absolute top-0 start-100 translate-middle">
      {{ count }}
    </span>
  </button>
</template>

<style scoped>
.position-relative {
  margin-right: 10px;
}
</style>
