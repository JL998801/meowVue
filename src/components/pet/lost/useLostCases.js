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

    // 🚀 取得會員的遺失案件
    const fetchLostCases = async () => {
        console.log("✅ 解析出的 memberId:", memberId.value); // 🐛 Debug
        if (!memberId.value || isNaN(memberId.value)) {
            console.error("❌ memberId 解析錯誤:", memberId.value);
            return;
        }

        isLoading.value = true;
        try {
            const response = await LostCaseAPI.getLostCases(memberId.value);
            console.log("📌 API 回應:", response.data); // 確認 API 回應的資料
        } catch (error) {
            console.error("❌ 獲取遺失案件失敗:", error);
        } finally {
            isLoading.value = false;
        }
    };

    // 🔄 更新當前頁面的案件
    const updatePage = (page) => {
        if (page < 1 || page > totalPages.value) return;
        currentPage.value = page;

        // ✅ 計算分頁範圍
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        losts.value = allLostCases.value.slice(start, end);
    };

    // 📌 切換頁面
    const goToPage = (page) => {
        updatePage(page);
    };

    // 🔍 取得單筆案件
    const fetchLostCaseById = async (lostCaseId) => {
        try {
            const response = await LostCaseAPI.getLostCaseById(lostCaseId);
            return response.data;
        } catch (err) {
            console.error("❌ 查詢案件失敗:", err);
            throw new Error("查詢案件失敗");
        }
    };

    // 📝 更新案件
    const updateLostCase = async (lostCaseId, updateData) => {
        try {
            await LostCaseAPI.updateLostCase(lostCaseId, updateData);
            await fetchLostCases(); // 重新載入列表
        } catch (err) {
            console.error("❌ 更新案件失敗:", err);
            throw new Error("更新案件失敗");
        }
    };

    // 監聽 memberId 變化，自動重新獲取案件
    watch(memberId, (newId) => {
        if (newId) fetchLostCases();
    }, { immediate: true });

    // ✅ 頁面載入時執行
    onMounted(() => {
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
