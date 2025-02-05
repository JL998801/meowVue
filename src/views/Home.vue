<template>
    <!-- 導覽按鈕 -->
    <div class="main-link-box">
        <ul class="list-unstyled">
            <li v-for="(link, index) in navLinks" :key="index" class="list-item fadeInUp">
                <div class="link-icon">
                    <i :class="link.iconClass" aria-hidden="true"></i>
                </div>
                <div class="link-text">
                    <h3 class="title">{{ link.title }}</h3>
                    <span class="sub-text">{{ link.subtitle }}</span>
                </div>
                <RouterLink class="wrap-a" :to="link.url" :title="link.title"></RouterLink>
            </li>
        </ul>
    </div>

    <!-- 案件廣告牆 -->
    <!-- <div>
        <Banner />
    </div> -->
</template>

<script setup>
import { ref } from "vue";
// import '@/assets/petmain.css'; 
import { RouterLink } from "vue-router";
// import GoogleMap from "@/components/GoogleMap.vue";
// import Banner from "@/components/Banner.vue";
import useUserStore from "@/stores/user.js";

const userStore = useUserStore();

// 定義 `navLinks` 為 `ref()`，使其成為可響應的變數
const navLinks = ref([
    { title: "救援通報", subtitle: "我發現受傷或走失的浪浪", url: "/pets/products", iconClass: "flo-icon icon-rescue" },
    { title: "送養計畫", subtitle: "我想幫助浪浪找一個家", url: "/adopt", iconClass: "flo-icon icon-adoption" },
    { title: "協尋系統", subtitle: "我家的寶寶走失了", url: "/pets/LostForm", iconClass: "flo-icon icon-lost" },
    { title: "寵物商城", subtitle: "想讓我家的寶寶過得更好", url: "/shop", iconClass: "flo-icon icon-about" },
    { title: "救援活動", subtitle: "浪浪需要你的援手", url: "/pets/products", iconClass: "flo-icon icon-about" }
]);
console.log("Home.vue 加載成功");
</script>
<style scoped>
/* 導覽按鈕 */
.main-link-box {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.list-unstyled {
    display: flex;
    gap: 20px;
}

.list-item {
    position: relative;
    padding: 15px;
    border-radius: 15px;
    border: 3px solid #feba07;
    background-color: #f9f9f9;
    text-align: center;
    width: 100%;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}

.inner-box {
    padding: 20px;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.list-item:hover {
    transform: scale(1.05);
    background-color: #feba07;
}

.link-icon {
    font-size: 50px;
    margin-bottom: 10px;
    color: #1d3557;
}

.link-text .title {
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 5px;
    color: #1d3557;
}

.link-text .sub-text {
    font-size: 14px;
    color: #666;
}

.wrap-a {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
}
</style>
