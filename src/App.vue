<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { RouterView } from "vue-router";
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
