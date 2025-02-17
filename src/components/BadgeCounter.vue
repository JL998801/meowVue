<template>
  <div class="badge-counter" @click="handleClick">
    <span class="icon">{{ icon }}</span>
    <span v-if="count > 0" class="badge">{{ count }}</span>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watchEffect, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'; // 假設有 Pinia 狀態管理

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  modalTarget: {
    type: String,
    default: '',
  },
  updateOnClick: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click', 'open-modal']);
const authStore = useAuthStore();
const isLoggedIn = ref(authStore.isAuthenticated);

const checkLoginStatus = () => {
  isLoggedIn.value = authStore.isAuthenticated;
};

watchEffect(() => {
  checkLoginStatus();
});

onMounted(() => {
  checkLoginStatus();
  setInterval(checkLoginStatus, 5000); // 每 5 秒自動檢查登入狀態
});

const handleClick = () => {
  emit('click');
  if (props.modalTarget) {
    emit('open-modal', props.modalTarget);
  }
};
</script>

<style scoped>
.badge-counter {
  position: relative;
  cursor: pointer;
  display: inline-block;
}

.icon {
  font-size: 24px;
}

.badge {
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
}
</style>
