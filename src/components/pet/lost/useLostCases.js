import { ref, onMounted, watch } from "vue";
import LostCaseAPI from "@/service/LostCaseAPI.js";

export default function useLostCases(memberId) {
    const losts = ref([]); // 存放目前頁面的案件
    const allLostCases = ref([]); // 存放所有案件
    const currentPage = ref(1);
    const pageSize = 5; // 每頁顯示的案件數量
    const totalPages = ref(1);
    const isLoading = ref(true); // 初始值設為 true，表示正在加載數據
    const error = ref(null);

    // **🚀 Debug: 監聽 memberId 變化**
    // watch(memberId, (newId) => {
    //     console.log("🐛 Debug - `memberId` 變更:", newId);
    //     if (newId) fetchLostCases();
    // }, { immediate: true });

    // **🚀 Debug: 監聽 losts**
    // watch(losts, (newLosts) => {
    //     console.log("🐛 Debug - `losts` 更新:", newLosts);
    // });

    // **🚀 Debug: 監聽 isLoading**
    watch(isLoading, (newStatus) => {
        console.log("🐛 Debug - `isLoading`:", newStatus);
    });

    // **🔄 取得會員的遺失案件**
    const fetchLostCases = async () => {
        console.log("✅ Debug - 解析出的 memberId:", memberId.value); // 🐛 Debug
        if (!memberId.value || isNaN(memberId.value)) {
            console.error("❌ Debug - `memberId` 解析錯誤:", memberId.value);
            return;
        }

        isLoading.value = true;
        try {
            console.log("📌 Debug - 發送 API 請求，memberId:", memberId.value);
            const response = await LostCaseAPI.getLostCases(memberId.value);
            console.log("📌 Debug - API 回應:", response.data); // 確認 API 回應的資料
            losts.value = response.data;
            if (!response || !Array.isArray(response.data)) {
                throw new Error("API 回應無效，請稍後重試！");
            }

            allLostCases.value = response.data.sort((a, b) => new Date(b.publicationTime) - new Date(a.publicationTime));
            totalPages.value = Math.max(1, Math.ceil(allLostCases.value.length / pageSize));

            console.log("✅ Debug - `allLostCases` 取得成功，共:", allLostCases.value.length, "筆");

            updatePage(1); // 設定第一頁
        } catch (err) {
            error.value = "❌ 獲取遺失案件失敗，請重試";
            console.error("❌ Debug - 獲取遺失案件失敗:", err);
        } finally {
            isLoading.value = false;
        }
    };

    // **🔄 更新當前頁面的案件**
    const updatePage = (page) => {
        if (page < 1 || page > totalPages.value) return;
        currentPage.value = page;

        // ✅ 計算分頁範圍
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        losts.value = allLostCases.value.slice(start, end);
        console.log("📌 Debug - 當前 `losts` 資料:", losts.value);
    };

    // **📌 切換頁面**
    const goToPage = (page) => {
        console.log("📌 Debug - 切換頁面:", page);
        updatePage(page);
    };

    //取得單比案件資訊
    const fetchLostCaseById = async (lostCaseId) => {
        try {
            console.log("🚀 發送 API 請求，案件 ID:", lostCaseId);
            const response = await LostCaseAPI.getLostCaseById(lostCaseId);

            console.log("✅ API 回應:", response.data);

            if (!response.data || Object.keys(response.data).length === 0) {
                console.warn("⚠️ API 回傳為空，確保後端有正確返回數據");
                return null; // 返回 null 避免 undefined
            }

            return response.data;
        } catch (err) {
            console.error("❌ API 查詢失敗:", err);
            return null; // API 失敗時回傳 null
        }
    };

    // **📝 更新案件**
    const updateLostCase = async (lostCaseId, updateData) => {
        console.log("🔍 發送 API 更新請求:", updateData);

        // 過濾掉 `null` 的 `latitude` 和 `longitude`
        const sanitizedData = { ...updateData };
        if (sanitizedData.latitude === null) delete sanitizedData.latitude;
        if (sanitizedData.longitude === null) delete sanitizedData.longitude;

        try {
            const response = await LostCaseAPI.updateLostCase(lostCaseId, sanitizedData);
            console.log("✅ 更新 API 回應:", response.data);
            fetchLostCases();
        } catch (error) {
            console.error("❌ 更新案件失敗:", error.response?.data || error);
        }
    };

    // **✅ 頁面載入時執行**
    onMounted(() => {
        console.log("📌 Debug - onMounted 執行，當前 memberId:", memberId.value);
        if (memberId.value) fetchLostCases();
    });

    return {
        losts,
        currentPage,
        totalPages,
        pageSize,
        isLoading,
        error,
        fetchLostCases,
        goToPage,
        fetchLostCaseById,
        updateLostCase,
    };
}
