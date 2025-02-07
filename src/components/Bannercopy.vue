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
                        v-for="(caseItem) in cases[category.type]"
                        :key="caseItem.id"
                        class="carousel-item"
                    >
                    <img :src="caseItem.imageUrl" alt="案件圖片" class="case-image" />
                    <p class="case-title">{{ caseItem.caseTitle }}</p>
                    </div>
                </div>
                <button @click="nextSlide(category.type)" class="nav-button">›</button>
            </div>

            <hr class="divider" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
// import image1 from '../images/image2.png';  //狗
// import image2 from '../images/lostcat1.png';  //貓

// 假案件數據
const caseCategories = ref([
    { type: "RESCUE", title: "流浪救援", moreLink: "/pets/rescue" },
    { type: "LOST", title: "遺失協尋", moreLink: "/pets/lost" },
    { type: "ADOPT", title: "動物認養", moreLink: "/adopt" }
]);

const cases = ref({
    RESCUE: [
        { id: 1, caseTitle: "台北市發現受傷流浪狗", imageUrl:'http://localhost:5173/images/image2.png' },
        { id: 2, caseTitle: "新北市夜市發現浪浪貓", imageUrl: 'http://localhost:5173/images/lostcat1.png' },
        { id: 3, caseTitle: "中市高架橋下發現流浪狗", imageUrl: 'http://localhost:5173/images/image2.png'},
        { id: 4, caseTitle: "南投偏鄉小村流浪狗", imageUrl: 'http://localhost:5173/images/image2.png' },
        { id: 5, caseTitle: "台南市公園內浪浪需要安置", imageUrl: 'http://localhost:5173/images/lostcat1.png' },
    ],
    LOST: [
        { id: 6, caseTitle: "尋找走失的柴犬（台北市）", imageUrl: 'http://localhost:5173/images/image2.png' },
        { id: 7, caseTitle: "貓咪走失且胡須很短（新竹市）", imageUrl: 'http://localhost:5173/images/lostcat1.png' },
        { id: 8, caseTitle: "遺失貓咪，特徵為虎斑（台中市）", imageUrl: 'http://localhost:5173/images/lostcat1.png' },
        { id: 9, caseTitle: "尋找遺失的虎斑貓（台南市）", imageUrl: 'http://localhost:5173/images/lostcat1.png' },
        { id: 10, caseTitle: "台北夜市發現的虎斑貓", imageUrl: 'http://localhost:5173/images/lostcat1.png' },
    ],
    ADOPT: [
        { id: 11, caseTitle: "可愛橘貓待認養（新北市）", imageUrl: 'http://localhost:5173/images/lostcat1.png' },
        { id: 12, caseTitle: "白色米克斯犬待領養（桃園市）", imageUrl: 'http://localhost:5173/images/image2.png' },
        { id: 13, caseTitle: "溫順黑白貓尋找新家（高雄市）", imageUrl: 'http://localhost:5173/images/lostcat1.png' },
        { id: 14, caseTitle: "找尋新主人的灰色貓（花蓮市）", imageUrl: 'http://localhost:5173/images/lostcat1.png' },
        { id: 15, caseTitle: "台南被棄養的小狗希望有新家", imageUrl: 'http://localhost:5173/images/image2.png' },
    ]
});

// **偵錯：確認數據是否加載成功**
onMounted(() => {
    console.log("案件數據：", cases.value);
});

// 顯示案件
const displayedCases = ref(cases.value);

// 切換到上一組
const prevSlide = (type) => {
    displayedCases.value[type].unshift(displayedCases.value[type].pop());
};

// 切換到下一組
const nextSlide = (type) => {
    displayedCases.value[type].push(displayedCases.value[type].shift());
};

// 自動輪播
onMounted(() => {
    setInterval(() => {
        Object.keys(displayedCases.value).forEach((type) => {
            nextSlide(type);
        });
    }, 3000);
});
</script>

<style scoped>
.carousel-container {
    max-width: 1200px;
    margin: auto;
}

.carousel-section {
    margin-bottom: 40px;
}

.carousel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
}

.title-container {
    display: flex;
    align-items: center;
    color: #C6BC77;

}

.category-title {
    font-size: 24px;
    font-weight: bold;
    color: #C6BC77;
    margin-left: 10px;
}

.more-button {
    text-decoration: none;
    font-size: 14px;
    color: #FEBA07;
    font-weight: bold;
}

.carousel-wrapper {
    display: flex;
    align-items: center;
}

.nav-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #C6BC77;
}

.carousel {
    display: flex;
    gap: 15px;
    overflow: auto; /* 允許滾動查看內容 */
    width: 100%;
    white-space: nowrap; /* 防止換行 */
}

.carousel-item {
    flex: 0 0 20%;
    text-align: center;
}

.case-image {
    width: 100%;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.case-title {
    font-size: 16px;
    font-weight: bold;
    margin-top: 5px;
}

.divider {
    border: 0;
    height: 1px;
    background: #FFFD77;
    margin: 20px 0;
}
</style>
