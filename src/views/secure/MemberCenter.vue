<template>
  <div class="container mt-5">
    <div class="row">
      <!-- 左側內容區 -->
      <h2>會員中心</h2>
      <div class="col-lg-9">
        <UserCard />
        <CaseStatistics />
        <Announcements />
      </div>
      <!-- 右側功能選單 -->
      <div class="col-lg-3">
        <SidebarMenu />
      </div>
    </div>
  </div>
</template>

<script setup>
import UserCard from "@/components/member/center/UserCard.vue";
import CaseStatistics from "@/components/member/center/CaseStatistics.vue";
import Announcements from "@/components/member/center/Announcements.vue";
import SidebarMenu from "@/components/member/center/SidebarMenu.vue";
</script>

<style>
</style>