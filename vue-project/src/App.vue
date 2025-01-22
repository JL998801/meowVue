<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navigationbar from "./views/Navigationbar.vue";
</script>

<template>
  <div>
    <Navigationbar></Navigationbar>
    <div class="container mt-4">
      <RouterView />
    </div>
  </div>
</template>

<style>

.container {
  border: black 1px solid;
  background-color: #ffffff;
  padding: 20px;
  /*box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 可選：添加陰影效果 */
  /*border-radius: 8px; /* 可選：圓角效果 */
}

</style>
