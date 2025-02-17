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
import { ref, onMounted, computed, watch } from "vue";
import Swal from "sweetalert2";
import useLostCases from "@/components/pet/lost/useLostCases.js";
import useUserStore from "@/stores/user.js";

const userStore = useUserStore();
const expandedCases = ref([]);
const memberId = computed(() => userStore.memberId ? Number(userStore.memberId) : null);

const {
    losts, currentPage, totalPages, fetchLostCases, goToPage, updateLostCase, isLoading
} = useLostCases(memberId);

watch(memberId, (newId) => {
    if (newId) fetchLostCases();
});

onMounted(() => {
    if (memberId.value) fetchLostCases();
});

const getStatusClass = (caseStateId) => {
    return caseStateId === 5 ? "status-pending" : caseStateId === 6 ? "status-found" : "";
};

const formatDate = (dateString) => {
    if (!dateString) return "無";
    return new Date(dateString).toLocaleDateString();
};

const confirmPetFound = async (lost) => {
    const result = await Swal.fire({
        title: "你家的寵物找到了嗎？",
        text: "如果已找到，請更新案件狀態",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "是，我找到了！",
        cancelButtonText: "取消",
    });

    if (result.isConfirmed) {
        try {
            await updateLostCase(lost.lostCaseId, { caseStateId: 6 });
            Swal.fire("更新成功", "案件狀態已更改為『已尋獲』", "success");
            fetchLostCases();
        } catch (error) {
            Swal.fire("錯誤", "更新案件狀態失敗，請稍後重試", "error");
        }
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
