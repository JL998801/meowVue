<template>
    要登入會員才可以進行舉報
    <div>
    舉報按鈕(連結到違規舉報頁面)
    </div>
    <div class="container">
        <h2>違規舉報</h2>
        
        <div class="form-group">
            <label>案件 ID：</label>
            <input v-model="report.caseId" type="text" readonly />
        </div>

        <div class="form-group">
            <label>違規會員 ID：</label>
            <input v-model="report.memberId" type="text" readonly />
        </div>

        <div class="form-group">
            <label>* 通報主旨：</label>
            <input v-model="report.subject" type="text" required />
        </div>

        <div class="form-group">
            <label>* 事由：</label>
            <textarea v-model="report.reason" required></textarea>
        </div>

        <button @click="submitReport" class="submit-btn">確認送出</button>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();

// 舉報表單的資料（動態從 URL 取得 caseId 和 memberId）
const report = ref({
    caseId: route.query.caseId || "", // 取得案件 ID
    memberId: route.query.memberId || "", // 取得會員 ID
    subject: "",
    reason: ""
});

// 監聽 onMounted，檢查是否有收到 `caseId`
onMounted(() => {
    if (!report.value.caseId || !report.value.memberId) {
        console.warn("⚠️ 缺少 caseId 或 memberId，請檢查 URL 參數！");
    }
});

// 提交表單
const submitReport = async () => {
    try {
        if (!report.value.subject || !report.value.reason) {
            alert("請填寫通報主旨和事由！");
            return;
        }

        const response = await axios.post("http://localhost:8080/api/reports", report.value);
        alert("舉報成功！");
        console.log("伺服器回應:", response.data);
    } catch (error) {
        console.error("舉報失敗:", error);
        alert("提交失敗，請重試");
    }
};
</script>
<style>
.container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 15px;
}

label {
    font-weight: bold;
    display: block;
}

input, textarea {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.submit-btn {
    width: 100%;
    background: #5CB85C;
    color: white;
    font-size: 18px;
    font-weight: bold;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
}

.submit-btn:hover {
    background: #4cae4c;
}
</style>