<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { RouterLink, RouterView } from 'vue-router';
import Navigationbar from "./views/Navigationbar.vue";
import TopButton from "./views/TopButton.vue";
import Footer from "./views/Footer.vue";
</script>

<template>
    <Navigationbar></Navigationbar>
    <RouterView />
    <TopButton />
    <Footer />
</template>

<style scoped>

</style>
