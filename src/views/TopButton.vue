<template>
    <!-- 每一頁都要有的返回頁首按鈕 -->
    <button class="back-to-top" v-show="isVisible" @click="scrollToTop">
        <font-awesome-icon :icon="['fas', 'chevron-up']" size="2xl" style="color: #feba07;" />
    </button>
</template>
    
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isVisible = ref(false);

// 監聽滾動事件
const handleScroll = () => {
    isVisible.value = window.scrollY > 200;
};

// 返回頂部
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// 掛載監聽器
onMounted(() => {
    window.addEventListener("scroll", handleScroll);
});

// 卸載監聽器（避免內存洩漏）
onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>
    
<style>
/* 按鈕樣式 */
.back-to-top {
    position: fixed;
    bottom: 40px;
    right: 20px;
    width: 50px;
    height: 50px;
    background-color: #fffd77;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.back-to-top:hover {
    background-color: #f9f9f9;
    transform: scale(1.1);
}
</style>