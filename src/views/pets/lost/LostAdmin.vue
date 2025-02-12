顯示所有的遺失案件
<template>
    <div>
        <h2>所有遺失案件</h2>
        <ul>
            <li v-for="caseItem in losts" :key="caseItem.lostCaseId">
                <p>案件標題: {{ caseItem.caseTitle }}</p>
                <p>案件狀態: {{ caseItem.caseState ? caseItem.caseState.caseStatement : "未提供" }}</p>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useLostCases from "@/composables/useLostCases.js";

const { losts, fetchAllLostCases } = useLostCases();

onMounted(fetchAllLostCases);
</script>
