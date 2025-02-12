<template>
    <div class="rescue-management-container">
        <!-- 主要內容 -->
        <main class="content">
            <h2>遺失協尋管理</h2>
            <div class="section-indicator">
                <span v-for="(dot, index) in 3" :key="index" class="dot" :class="{ active: index === 0 }"></span>
            </div>

            <div class="lost-header">
                <font-awesome-icon icon="paw" />
                <span>我的協尋記錄</span>
                <button @click="goToForm">+ 新增</button>
            </div>

            <div class="lost-list">
                <div v-for="lost in losts" :key="lost.lostCaseId" class="lost-card">
                    <!-- 案件標題 -->
                    <h3>{{ lost.caseTitle }}</h3>

                    <!-- 遺失案件編號 -->
                    <p class="lost-id">
                        遺失案件編號：<span class="highlight">{{ lost.lostCaseId }}</span>
                    </p>

                    <!-- 案件狀態 -->
                    <p v-if="lostCase.caseState">
                        案件狀態: {{ lostCase.caseState.caseStatement }}
                    </p>

                    <!-- 最後更新日期 -->
                    <p>最後更新日期：{{ lost.lastUpdateTime }}</p>

                    <!-- 建立日期 -->
                    <p>建立日期：{{ lost.publicationTime }}</p>
                </div>
            </div>

            <!-- 分頁按鈕 -->
            <div class="pagination">
                <button class="page-btn" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                    &lt; 上一頁
                </button>
                <span class="current-page">{{ currentPage }}</span>
                <button class="page-btn" @click="goToPage(currentPage + 1)" :disabled="currentPage >= totalPages">
                    下一頁 &gt;
                </button>
            </div>
        </main>

        <!-- 右側功能選單 -->
        <aside>
            <SidebarMenu />
        </aside>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import SidebarMenu from "@/components/member/SidebarMenu.vue";
import useLostCases from "@/components/pet/lost/useLostCase.js"; // ✅ 引入 useLostCases.js
import { useRouter } from "vue-router";

const router = useRouter();

const goToForm = () => {
    router.push("/pet/lostform");
};

// 會員 ID (假設是從登入狀態取得)
const memberId = 1; // 這裡應該從 Vuex / Pinia / localStorage 取得會員 ID

// 使用 useLostCases composable
const { losts, currentPage, totalPages, fetchLostCases, goToPage } = useLostCases(memberId);

// 畫面載入時取得案件資料
onMounted(fetchLostCases);
</script>

<style scoped>

</style>
