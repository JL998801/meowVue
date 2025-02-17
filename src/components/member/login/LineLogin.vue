<template>
  <div>
    <!-- line登入又分為已經註冊過的用戶(有memberId，要記得從token取出傳給後端)，跟沒註冊過的用戶(沒有memberId) -->
    <a :href="lineLoginUrl" v-if="lineLoginUrl">
      <img src="@/assets/lineLogin.png" alt="LINE 登入" />
    </a>
    <p v-else>正在加載 LINE 登入連結...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { axiosapi2 } from "@/plugins/axios";
import useUserStore from "@/stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const lineLoginUrl = ref(""); // 儲存 LINE 登入的 URL
const memberId = computed(() => userStore.memberId); // 直接從Pinia store解析token取出 memberId

// 在組件掛載時，從後端獲取 LINE 授權 URL
onMounted(async () => {
  console.log("解析出 memberId 為：" + memberId.value); // ✅ 直接使用 Pinia 中的 memberId

  try {
    const response = await axiosapi2.get(`/line/authorize`, {
      params: { memberId: memberId.value }, // ✅ 直接從 Pinia 取值
    });
    lineLoginUrl.value = response.data;
    console.log("LINE 登入 URL 為：" + lineLoginUrl.value);
  } catch (error) {
    console.error("無法獲取 LINE 登入連結: ", error);
  }
});
</script>

<style scoped></style>
