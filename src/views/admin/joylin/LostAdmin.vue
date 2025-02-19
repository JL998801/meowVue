<template>
    <div class="lost-management-container">
        <main class="content">
            <h2>遺失協尋管理</h2>
            <div class="section-indicator">
                <span v-for="(dot, index) in 3" :key="index" class="dot" :class="{ active: index === 0 }"></span>
            </div>

            <div v-if="isLoading" class="loading">載入中...</div>
            <div v-else-if="losts.length === 0" class="no-records">查無紀錄。</div>
            
            <div v-else class="lost-list">
    <div v-for="lost in losts" :key="lost.lostCaseId" class="lost-card">
        <h3 @click="confirmPetFound(lost)">{{ lost.caseTitle }}</h3>
        <p class="lost-id">案件編號：<span class="highlight">{{ lost.lostCaseId }}</span></p>
        
        <div class="lost-status">
            案件狀態：
            <span class="status">{{ lost.caseState }}</span>
        </div>

        <p>最後更新日期：{{ formatDate(lost.lastUpdateTime) }}</p>
        <p>建立日期：{{ formatDate(lost.publicationTime) }}</p>

        <button class="expand-btn" @click="toggleExpand(lost.lostCaseId)">
            {{ expandedCases.includes(lost.lostCaseId) ? '收起' : '展開' }}
        </button>

        <div v-show="expandedCases.includes(lost.lostCaseId)" class="expanded-content">
            <p>寵物類別：{{ lost.species }}</p>
            <p>寵物名稱：{{ lost.name }}</p>
            <p>性別：{{ lost.gender }}</p>
            <p>品種：{{ lost.breed }}</p>
            <p>毛色：{{ lost.furColor }}</p>
            <p>絕育狀態：{{ lost.sterilization }}</p>
            <p>晶片號碼：{{ lost.microChipNumber }}</p>
            <p>地點: {{ lost.cityName }}{{ lost.districtAreaName }}{{ lost.street }}</p>
            <p>走失經過：{{ lost.lostExperience }}</p>
            <p>特徵描述: {{ lost.featureDescription }}</p>
            <p>聯絡資訊: {{ lost.contactInformation }}</p>
        </div>
    </div>
</div>
            <div class="pagination">
                <button class="page-btn" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">&lt; 上一頁</button>
                <span class="current-page">{{ currentPage }}</span>
                <button class="page-btn" @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages">下一頁 &gt;</button>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useUserStore from "@/stores/user.js";
import { axiosapi } from "@/plugins/axios.js";

const userStore = useUserStore();
const losts = ref([]);
const isLoading = ref(true);
const expandedCases = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);

const fetchLostCases = async () => {
    try {
        isLoading.value = true;
        const response = await axiosapi.get("/lostcases/all");
        
        // ✅ 確保 API 返回的資料結構與前端對應
        losts.value = response.data.map(lost => ({
            lostCaseId: lost.lostCaseId,
            caseTitle: lost.caseTitle,
            name: lost.name ,
            gender: lost.gender || "未知",
            sterilization: lost.sterilization,
            microChipNumber: lost.microChipNumber || "無",
            caseState: lost.caseState,
            species: lost.species,
            breed: lost.breed ,
            furColor: lost.furColor ,
            memberNickName: lost.memberNickName ,
            publicationTime: lost.publicationTime,
            lastUpdateTime: lost.lastUpdateTime,
            contactInformation: lost.contactInformation || "無聯絡資訊",
            featureDescription: lost.featureDescription ,
            lostExperience: lost.lostExperience ,
            cityName: lost.cityName,
            districtAreaName: lost.districtAreaName,
            street: lost.street || ""
        }));

        totalPages.value = Math.ceil(response.data.length / 10);
    } catch (error) {
        console.error("❌ 無法獲取遺失案件:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchLostCases();
});
const formatDate = (dateString) => {
    if (!dateString) return "未知日期";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
};


const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchLostCases();
    }
};

const toggleExpand = (caseId) => {
    if (expandedCases.value.includes(caseId)) {
        expandedCases.value = expandedCases.value.filter(id => id !== caseId);
    } else {
        expandedCases.value.push(caseId);
    }
};
</script>

<style scoped>
/* 整體背景 */
.rescue-management-container {
    background-color: #f9f9f9;  /* 主背景 */
    min-height: 100vh;
    padding: 20px;
}

/* 標題樣式 */
h2 {
    background-color: #C6BC77;
    color: black;
    text-align: center;
    padding: 15px;
    border-radius: 8px;
}

/* 案件列表 */
.lost-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
}

/* 案件卡片 */
.lost-card {
    background-color: #f9f9f9; /* 案件背景 */
    border: 2px solid #C6BC77;
    padding: 15px;
    border-radius: 10px;
    transition: transform 0.2s ease-in-out;
}

.lost-card:hover {
    transform: scale(1.02);
}

/* 案件狀態標籤 */
.status {
    background-color: #FEBA07;
    color: black;
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: bold;
}

/* 按鈕樣式 */
.expand-btn {
    background-color: #C6BC77;
    color: black;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

.expand-btn:hover {
    background-color: #FEBA07;
}

/* 分頁按鈕 */
.pagination {
    margin-top: 20px;
    text-align: center;
}

.page-btn {
    background-color: #C6BC77;
    color: black;
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 5px;
}

.page-btn:hover {
    background-color: #FEBA07;
}

.current-page {
    font-weight: bold;
    color: black;
    font-size: 18px;
}
</style>