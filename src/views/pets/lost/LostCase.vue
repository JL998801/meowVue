<template>
    <div v-if="lostCase">
        <div class="lost-page">
            <h1>{{ lostCase.caseTitle }}</h1>
            <div class="second-container">
                <div class="main-content">
                    <div>
                        <CaseData v-if="lostCase" :caseData="lostCase" />
                        <p v-else>載入中...</p>
                    </div>

                    <div class="edit-button">
                        <div v-if="canEdit && lostCase" class="member-buttons">
                            <router-link :to="`/pet/lostCase/edit/${lostCase.lostCaseId}`" class="router-link">
                                <button @click="editCase">編輯案件</button>
                            </router-link>
                            <router-link :to="`/pet/lostCase/update/${lostCase.lostCaseId}`" class="router-link">
                                <button @click="updateProgress">進度更新</button>
                            </router-link>
                        </div>
                        <div v-else>
                            <button>通知失主</button>
                        </div>
                    </div>

                    <div class="share-buttons">
                        <a href="#">分享至 Facebook</a>
                        <a href="#">分享至 Line</a>
                    </div>

                    <div class="lost-details">
                        <div class="lost-reason">
                            <CaseLostReason v-if="lostCase" :lostReason="lostCase" />
                        </div>
                    </div>

                    <div class="sidebar">
                        <div class="support-button">
                            <RouterLink to="/pet/lost/add" class="button-link">
                                新增遺失通報
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup> 
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import CaseData from '@/components/pet/lost/case/CaseData.vue';
import CaseLostReason from '@/components/pet/lost/case/CaseLostReason.vue';
import useUserStore from '@/stores/user.js'; // 載入 Pinia 的 user store


const baseUrl = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();
const lostCase = ref({});
const userStore = useUserStore(); // 取得 Pinia 狀態

// 保存案件進度數據
const lostProgressList = ref([]);

// 從後端獲取案件進度數據
const fetchLostProgress = async () => {
    try {
        const caseId = route.params.id;  
        const response = await axios.get(
        `${baseUrl}/LostCase/lostProgress/${caseId}`
        );

        //打進救援進度結果
        console.log(response.data);

        // 將返回的數據存入 lostProgressList
        lostProgressList.value = response.data;
    } catch (error) {
        console.error("獲取案件進度數據失敗:", error);
    }
};


// 獲取當前登入的 memberId，進而決定是否顯示案件編輯
const userMemberId = computed(() => {
    console.log("從pinia抓到memberId", userStore.memberId);
    return userStore.memberId});

    // 判斷是否顯示「編輯案件」與「進度更新」按鈕
    const canEdit = computed(() => {
    console.log("案件會員id為", lostCase.value.memberId);
    console.log("進入會員id為", userMemberId.value);
    return lostCase.value && userMemberId.value === lostCase.value.memberId;
    });

    // 編輯案件功能
    const editCase = () => {
    console.log("進入編輯模式");
};

// 進度更新功能
const updateProgress = () => {
    console.log("進入進度更新模式");
};


onMounted(async () => {
    fetchLostProgress();  //向後端拿救援案件進度
    const caseId = route.params.id;
    try {
        const response = await axios.get(`${baseUrl}/LostCase/search/${caseId}`);
        lostCase.value = response.data || {};  //確保 lostCase 不為 null，會導致傳遞給子組件報錯
        lostCase.value.casePictures = lostCase.value.casePictures || [];
        console.log("案件資訊為",response.data);
    } catch (error) {
        console.error("載入案件失敗", error);
    }
});
</script>


<style scoped>
.member-buttons{
    display: flex;         /* 使用 Flexbox */
    gap: 30px;             /* 設置按鈕間距 */
    justify-content: center;
}

.member-buttons button,
.member-buttons .router-link {
    flex: 1; /* 讓按鈕平均分配可用空間 */
    text-align: center; /* 讓按鈕文字置中 */
    min-width: 180px; /* 設置最小寬度，避免按鈕太小 */
}

h1 {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 40px;
    letter-spacing: 1px;
}

.lost-page {
    margin: 35px auto;
    max-width: 1200px;
}

.sidebar {
    flex: 1 1 20%;
    max-width: 100%;
    margin-top: 30px;
    margin-left: 80px;
    text-align: center;
    flex-direction: column; /* 垂直排列 */
    align-items: center; /* 元素居中對齊 */
    display: flex; /* 使用 Flexbox */
}

.sidebar .support-button {
    margin-bottom: 40px;
    width: 200px;
}

.button-link {
    display: inline-block;
    font-weight: 500;
    letter-spacing: 2px; /* 增加字元之間的距離 */
    background-color: #c6bc77;
    color: white;
    padding: 10px 20px;
    font-size: 20px;
    text-align: center;
    text-decoration: none;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    height: 100px;
    width: 200px;
    box-shadow: 0px 2px 2px #6a6a6a;
    line-height: 100px; /* 讓文字垂直置中 */
}

.button-link:hover {
    background-color: #aca269;
}

.advertisement {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    width: 70%;
}

.advertisement img {
    max-width: 100%;
    border-radius: 5px;
}

.second-container {
    display: flex;
    flex-direction: row; /* 水平排列 */
    justify-content: space-between; /* 左右分佈 */
    align-items: flex-start; /* 元素頂部對齊 */
}

.main-content {
    flex: 18; /* 主內容區域占 3 倍空間 */
    display: flex;
    flex-direction: column; /* 垂直排列 SearchForm 和 CaseList */
}

.edit-button {
    width: 100%;
    text-align: center;
    margin: 30px auto;
}

.edit-button button {
    background-color: #edeeef;
    color: rgb(63, 63, 63);
    width: 90%;
    height: 70px;
    font-size: 20px;
    font-weight: 600;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0px 2px 2px #bbb7b7;
}

.edit-button button:hover {
    background-color: #cecccc;
}

.lost-details {
    margin-top: 70px;
    border-radius: 8px;
    padding: 20px;
}

.lost-reason {
    padding-bottom: 30px;
    border-bottom: 3px solid #ddd;
}

.lost-progress {
    padding-bottom: 30px;
    border-bottom: 3px solid #ddd;
}

.lost-progress h3 {
    font-weight: 500;
}

.comments-section {
    width: 100%;
    margin-top: 30px;
}

.comments-section h3 {
    font-size: 18px;
    margin-bottom: 10px;
}

.comments-section textarea {
    width: 100%;
    height: 80px;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    resize: none;
}

.comments-section button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.comments-section button:hover {
    background-color: #0056b3;
}
</style>