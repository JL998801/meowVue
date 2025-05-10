<template>
  <div class="card mb-4">
    <div class="card-body text-center">
      <img
        src="https://via.placeholder.com/150"
        alt="User Avatar"
        class="rounded-circle mb-3"
        width="100"
        height="100"
      />
      <h5 class="card-title">{{ name }}</h5>
      <p class="card-text">會員 ID：{{ memberId }}</p>
      <div>
        <span class="badge bg-primary">已驗證手機</span>
        <span class="badge bg-success">已啟動Line Notify</span>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from "vue";

const name = ref("李冠儒");
const memberId = ref("173097558201");
</script>