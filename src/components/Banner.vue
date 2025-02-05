<template>
    <div class="carousel-container">
        <div v-for="category in caseCategories" :key="category.type" class="carousel-section">
            <div class="carousel-header">
                <div class="title-container">
                    <font-awesome-icon :icon="['fas', 'paw']" size="xl" style="color: #c6bc77;" />
                    <h3>{{ category.title }}</h3>
                </div>
            <router-link :to="category.moreLink" class="more-button">查看更多</router-link>
            </div>

        <div class="carousel-wrapper">
            <button @click="prevSlide(category.type)" class="nav-button">‹</button>
                <div class="carousel">
                    <div
                        v-for="(caseItem, index) in displayedCases[category.type]"
                        :key="caseItem.id"
                        class="carousel-item"
                    >           
                        <img :src="caseItem.imageUrl" alt="案件圖片" class="case-image" />
                        <p class="case-title">{{ caseItem.caseTitle }}</p>
                    </div>
                </div>
            <button @click="nextSlide(category.type)" class="nav-button">›</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// 分類設定
const caseCategories = ref([
    { title: "流浪救援", type: "RESCUE", moreLink: "/rescue", icon: "/icons/rescue.svg" },
    { title: "遺失協尋", type: "LOST", moreLink: "/lost", icon: "/icons/lost.svg" },
    { title: "動物認養", type: "ADOPT", moreLink: "/adopt", icon: "/icons/adopt.svg" }
]);

// 存儲所有案件
const cases = ref({
    RESCUE: [],
    LOST: [],
    ADOPT: []
});

// 當前顯示的 5 個案件
const displayedCases = ref({
    RESCUE: [],
    LOST: [],
    ADOPT: []
});

// 獲取案件資料
const fetchCases = async () => {
    try {
        const response = await axios.get("http://localhost:8080/Banners");
        response.data.forEach((item) => {
            if (cases.value[item.caseType]) {
            cases.value[item.caseType].push(item);
            }
        });

        // 設定初始顯示的 5 個案件
        caseCategories.value.forEach(category => {
            displayedCases.value[category.type] = cases.value[category.type].slice(0, 5);
        });

        startAutoSlide();
    } catch (error) {
        console.error("獲取案件失敗", error);
    }
};

// 自動輪播
const startAutoSlide = () => {
    setInterval(() => {
        caseCategories.value.forEach(category => {
        nextSlide(category.type);
        });
    }, 3000);
};

// 下一個
const nextSlide = (type) => {
    if (cases.value[type].length > 5) {
        cases.value[type].push(cases.value[type].shift());
        displayedCases.value[type] = cases.value[type].slice(0, 5);
    }
};

// 上一個
const prevSlide = (type) => {
    if (cases.value[type].length > 5) {
        cases.value[type].unshift(cases.value[type].pop());
        displayedCases.value[type] = cases.value[type].slice(0, 5);
    }
};

onMounted(fetchCases);
</script>

<style scoped>
/* 背景與容器 */
.carousel-container {
    max-width: 1200px;
    margin: auto;
    padding: 20px;
}

/* 每個類別的區塊 */
.carousel-section {
    margin-bottom: 20px;
    background: #f9f9f9;
    padding: 15px;
    border-radius: 10px;
    opacity: 0.95;  /* 讓背景變透明 */
}

/* 標題與按鈕 */
.carousel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    color: #FEBA07;
}

/* 類別標題區 */
.title-container {
    display: flex;
    align-items: center;
}

.section-icon {
    color: #C6BC77;
    margin-right: 8px;
}

/* 查看更多按鈕 */
.more-button {
    background-color: #C6BC77;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    text-decoration: none;
    font-size: 14px;
}

/* 輪播區 */
.carousel-wrapper {
    display: flex;
    align-items: center;
    overflow: hidden;
}

/* 案件廣告輪播 */
.carousel {
    display: flex;
    gap: 10px;
    overflow: hidden;
    width: 100%;
}

.carousel-item {
    width: 200px;
    text-align: center;
}

/* 案件圖片 */
.case-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 5px;
}

/* 案件標題 */
.case-title {
    font-size: 14px;
    margin-top: 5px;
}

/* 左右導航按鈕 */
.nav-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}
</style>
