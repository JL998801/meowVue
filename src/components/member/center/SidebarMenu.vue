<template>
  <div class="list-group">
    <RouterLink
      v-for="(item, index) in menuItems"
      :key="index"
      :to="item.link"
      class="list-group-item list-group-item-action"
    >
      {{ item.label }}
    </RouterLink>
    <button class="list-group-item list-group-item-action text-danger" @click="logout">
      登出 <i class="bi bi-box-arrow-right"></i>
    </button>
  </div>
</template>
  
<script setup>
import { useRouter } from "vue-router";
  
const router = useRouter();
const menuItems = [
  { label: "會員基本資料", link: "/basic-info" },
  { label: "追蹤通知設定", link: "/advanced-settings" },
  { label: "流浪救援管理", link: "/rescue-management" },
  { label: "動物送養管理", link: "/adoption-management" },
  { label: "動物領養管理", link: "/foster-management" },
  { label: "遺失協尋管理", link: "/lost-management" },
  { label: "追蹤案件管理", link: "/follow-management" },
  { label: "違規通報管理", link: "/violation-management" },
];

function logout() {
  console.log("執行登出邏輯");
  router.push("/secure/login");
}
</script>
  
<style>
</style>