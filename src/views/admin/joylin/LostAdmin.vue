<template>
    <div class="rescue-management-container">
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
                        <span class="status" :class="getStatusClass(lost.caseState?.caseStateId)">
                            {{ lost.caseState?.caseStatement || "未知狀態" }}
                        </span>
                    </div>
                    <p>最後更新日期：{{ formatDate(lost.lastUpdateTime) }}</p>
                    <p>建立日期：{{ formatDate(lost.publicationTime) }}</p>
                    
                    <button class="expand-btn" @click="toggleExpand(lost.lostCaseId)">
                        {{ expandedCases.includes(lost.lostCaseId) ? '收起' : '展開' }}
                    </button>

                    <div v-show="expandedCases.includes(lost.lostCaseId)" class="expanded-content">
                        <p>寵物類別：{{ lost.species?.species || '未知' }}</p>
                        <p>寵物名稱：{{ lost.name || '未知' }}</p>
                        <p>性別：{{ lost.gender || '未知' }}</p>
                        <p>品種：{{ lost.breed?.breed || '未知' }}</p>
                        <p>毛色：{{ lost.furColor?.furColor || '未知' }}</p>
                        <p>絕育狀態：{{ lost.sterilization || '未知' }}</p>
                        <p>晶片號碼：{{ lost.microChipNumber || "無" }}</p>
                        <p>地點: {{ lost.city?.city || '未知城市' }}{{ lost.districtArea?.districtAreaName || '' }}{{ lost.street || '' }}</p>
                        <p>走失經過：{{ lost.lostExperience || '未知' }}</p>
                        <p>特徵描述: {{ lost.featureDescription || '未知' }}</p>
                        <p>聯絡資訊: {{ lost.contactInformation || '無聯絡資訊' }}</p>
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
        losts.value = response.data;
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

