<template>
    <div class="rel flex justify-b px-150 py-8 min-h">
        <!-- 會員中心 -->
        <div class="w-full max-w bg-w shadow-lg rounded p-6">
        <h2 class="text-2x font-b text-gray-7 center mb-4">會員中心</h2>

        <div class="flex-col items-c my-4">
            <h3 class="text-lg font-s mt-2">{{ nickname }}</h3>
            <p class="text-gray-5 text-sm">會員 ID：<span class="qq font-b">{{ memberId }}</span></p>
            <div class="mt-2 flex gap-2">
            <button class="bg-bu text-w px-3 py-1 rounded text-sm">已驗證手機</button>
            <button class="bg-re text-w px-3 py-1 rounded text-sm">未連動 Line Notify</button>
            </div>
        </div>

        <!-- 案件數 -->
        <div class="gap-4 text-center">
            <div class="p-4 bg-w border rounded shadow">
            <p class="text-xl font-b text-gray-7">1</p>
            <p class="text-gray-5 text-sm">救援案件數</p>
            </div>
            <div class="p-4 bg-w border rounded shadow">
            <p class="text-xl font-b text-gray-7">1</p>
            <p class="text-gray-5 text-sm">送養案件數</p>
            </div>
            <div class="p-4 bg-w border rounded shadow">
            <p class="text-xl font-b text-gray-7">1</p>
            <p class="text-gray-5 text-sm">遺失案件數</p>
            </div>
            <div class="p-4 bg-w border rounded shadow">
            <p class="text-xl font-b text-gray-7">1</p>
            <p class="text-gray-5 text-sm">領養案件數</p>
            </div>
        </div>

        <!-- 最新公告與通知 -->
        <div class="bg-gray-5 p-4 rounded shadow">
            <h3 class="text-lg font-s text-gray-7">最新公告與通知</h3>
            <p class="text-gray-5 text-sm mt-2 leading-r">
            歡迎回到浪途！！<br />
            非常感謝您的加入，<br />
            希望各位會員都能夠一起參與網站上的通報案件，無論是救援、送養/認養、協尋，<br />
            一起發揮力量，讓更多需要救援的浪浪度過難關，無家可歸的浪浪找到溫暖的家，迷路在外的毛孩點點回家。
            </p>
        </div>
        </div>

        <!-- 功能選單 -->
        <aside >
        <SidebarMenu class="fixed-sidebar "/>
        </aside>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SidebarMenu from "@/components/member/SidebarMenu.vue";

const nickname = ref('');
const memberId = ref('');
const router = useRouter();

onMounted(() => {
    // 當組件掛載後，從 localStorage 取出 nickname 和 memberId
    const storedNickname = localStorage.getItem('nickname');
    const storedMemberId = localStorage.getItem('memberId');
    
    // 如果存在，將其設置到 ref 中
    if (storedNickname) {
        nickname.value = storedNickname;
    }
    
    if (storedMemberId) {
        memberId.value = storedMemberId;
    }
});

</script>

<style scoped>
/* 基础全局样式 */
.fixed-sidebar {
    font-family: 'Noto Sans KR', sans-serif;
    position: fixed;
    top: 200px;
    right: 200px;
    width: 250px;
    background-color: #f4f4f4;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}
body {
    background-color: #f7fafc;
}

.rel {
    position: relative;
}

.flex {
    display: flex;
}

.justify-b {
    justify-content: space-between;
}
.px-150 {
    padding-left: 150px;
    padding-right: 150px;
}
.py-8 {
    padding-top: 2rem;
    padding-bottom: 2rem;
}
.min-h {
    min-height: 100vh;
}
/* 会员中心 */
.w-full {
    font-family: 'Noto Sans KR', sans-serif;
    margin-top: 50px;
    margin-left: 100px;
    width: 100%;
}
.max-w {
    max-width: 56rem;
}
.bg-w {
    background-color: #ffffff;
}
.bg-bu {
    background-color: #3b82f6;
}
.bg-re {
    background-color: #f87171;
}
.bg-gray-5 {
    background-color: #f9fafb;
}
.bg-g {
    background-color: #C6BC77;
}
.text-w {
    color: #ffffff;
}
.text-gray-7 {
    color: #4a5568;
}
.text-gray-5 {
    color: #a0aec0;
}
.text-lg {
    font-size: 1.125rem;
}
.text-2x {
    font-size: 1.5rem;
}
.text-xl {
    font-size: 1.25rem;
}
.text-sm {
    font-size: 0.875rem;
}
.font-b {
    font-weight: 700;
}
.font-s {
    font-weight: 600;
}
.center {
    text-align: center;
}
.shadow, .shadow-lg {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.shadow-lg {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
.rounded {
    border-radius: 0.5rem;
}
.p-6, .p-4, .p-2 {
    padding: 1.5rem;
}
.p-4 {
    padding: 1rem;
}
.p-2 {
    padding: 0.5rem;
}
.border-2 {
    border-width: 2px;
}
.border {
    border-width: 1px;
}
.border-gray {
    border-color: #e2e8f0;
}
.mb-4, .my-4, .mt-4 {
    margin-bottom: 1rem;
}
.mt-2 {
    margin-top: 0.5rem;
}
.gap-2 {
    gap: 0.5rem;
}
.gap-4 {
    gap: 1rem;
    display: flex; 
}
.flex-col {
    flex-direction: column;
}
.items-c {
    align-items: center;
}
.w-60 {
    width: 15rem;
}
.cursor-p {
    cursor: pointer;
}
.leading-r {
    line-height: 1.625;
}
.space-y-2 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
}
/* 功能選單 */
.fixed {
    position: fixed;
}
.right-150 {
    right: 150px;
}
</style>
