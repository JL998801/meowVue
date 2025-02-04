<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { RouterLink, RouterView } from 'vue-router';
import Navigationbar from "./views/Navigationbar.vue";
import TopButton from "./views/TopButton.vue";
</script>

<template>
  <Navigationbar /> <!-- Navigation bar only appears here -->
  <RouterView /> <!-- Dynamically render pages based on routing -->
  <TopButton /> <!-- Always shown button -->
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  margin: 0;
  padding: 0;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: #343a40;
  color: white;
  padding: 20px;
  text-align: center;
}

nav {
  margin-top: 15px;
}

nav a {
  margin: 0 20px;
  text-decoration: none;
  color: #007bff;
  font-size: 18px;
}

nav a:hover {
  text-decoration: underline;
}
</style>
