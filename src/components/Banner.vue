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
                        v-for="caseItem in displayedCases[category.type]"
                        :key="caseItem.id"
                        class="carousel-item"
                        @click="goToCaseDetail(caseItem)" 
                        style="cursor: pointer;"
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

// 案件分類
const caseCategories = ref([
    { title: "流浪救援", type: "RESCUE", moreLink: "/rescue" },
    { title: "遺失協尋", type: "LOST", moreLink: "/lost" },
    { title: "動物認養", type: "ADOPT", moreLink: "/adopt" }
]);

// 存儲所有案件
const cases = ref({
    RESCUE: [],
    LOST: [],
    ADOPT: []
});

// 當前顯示的 5 個最新案件
const displayedCases = ref({
    RESCUE: [],
    LOST: [],
    ADOPT: []
});

// 獲取 Banner 資料，過濾已隱藏的並按時間排序
const fetchBannerData = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/banners");
        let banners = response.data;

        // 過濾掉 `isHidden: true` 的 Banner
        banners = banners.filter(banner => !banner.isHidden);

        // 按 `onlineDate` 降冪排序，確保最新的 Banner 在最前面
        banners.sort((a, b) => new Date(b.onlineDate) - new Date(a.onlineDate));

        // 清空 `cases`，避免重複資料
        cases.value = { RESCUE: [], LOST: [], ADOPT: [] };

        banners.forEach(banner => {
            if (cases.value[banner.bannerType]) {
                cases.value[banner.bannerType].push({
                    id: banner.lostCaseId || banner.adoptionCaseId || banner.rescueCaseId,
                    caseTitle: banner.caseTitle || "未知標題",
                    imageUrl: banner.imageUrl || "http://localhost:5173/images/default.png",
                    type: banner.bannerType // 儲存案件類型，方便導向詳情頁
                });
            }
        });

        // 只顯示最新的 5 條案件
        displayedCases.value = {
            RESCUE: cases.value.RESCUE.slice(0, 5),
            LOST: cases.value.LOST.slice(0, 5),
            ADOPT: cases.value.ADOPT.slice(0, 5)
        };

    } catch (error) {
        console.error("獲取 Banner 資料失敗:", error);
    }
};

// 點擊 Banner，導向對應的案件詳情頁面
const goToCaseDetail = (caseItem) => {
    if (!caseItem.id || !caseItem.type) return;
    window.location.href = `/cases/${caseItem.type.toLowerCase()}/${caseItem.id}`;
};

// 自動輪播
const startAutoSlide = () => {
    setInterval(() => {
        caseCategories.value.forEach(category => {
            nextSlide(category.type);
        });
    }, 3000);
};

// 下一組
const nextSlide = (type) => {
    if (cases.value[type].length > 5) {
        cases.value[type].push(cases.value[type].shift());
        displayedCases.value[type] = cases.value[type].slice(0, 5);
    }
};

// 上一組
const prevSlide = (type) => {
    if (cases.value[type].length > 5) {
        cases.value[type].unshift(cases.value[type].pop());
        displayedCases.value[type] = cases.value[type].slice(0, 5);
    }
};

// 進入頁面時執行
onMounted(async () => {
    await fetchBannerData(); // 先獲取最新案件
    startAutoSlide(); // 開啟自動輪播
});
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
