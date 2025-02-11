<template>
    <div>
        <!-- 舉報按鈕 -->
        <button @click="goToReportPage(caseId, memberId)" class="report-btn">舉報案件</button>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

// 假設 `caseData` 是當前案件的資訊，來自 API 或 Vue 組件的 props
const caseData = {
    id: 789123, // 測試用，應該從案件詳情 API 獲取
    memberId: 456789 // 測試用，應該從案件詳情 API 獲取
};

// 點擊舉報按鈕後跳轉到舉報頁面
const goToReportPage = () => {
    if (!caseData.id || !caseData.memberId) {
        console.error("⚠️ 缺少 caseId 或 memberId，無法跳轉到舉報頁面！");
        return;
    }

    router.push({
        path: "/pets/reportform",
        query: {
            caseId: caseData.id,
            memberId: caseData.memberId
        }
    });
};
</script>

<style scoped>
.report-btn {
    background: #d9534f;
    color: white;
    font-size: 16px;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.report-btn:hover {
    background: #c9302c;
}
</style>
