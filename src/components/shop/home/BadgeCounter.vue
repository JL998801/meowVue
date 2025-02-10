<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  icon: String,  // ✅ 傳入圖標 (如 🛒)
  count: Number, // ✅ 傳入數量
  modalTarget: String // ✅ 綁定對應的 Modal
});

const emit = defineEmits(["open-modal"]);
</script>

<template>
  <button class="btn btn-outline-primary" data-bs-toggle="modal" :data-bs-target="modalTarget">
    {{ icon }} <span v-if="count > 0" class="badge bg-warning">{{ count }}</span>
  </button>
</template>

<style scoped>
.position-relative {
  margin-right: 10px;
}
</style>
