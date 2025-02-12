import { ref, onMounted } from "vue";
import LostCaseAPI from "@/service/LostCaseAPI.js";

export default function useLostCases(memberId) {
    const losts = ref([]);
    const currentPage = ref(1);
    const pageSize = 5; // 每頁顯示的案件數量
    const totalPages = ref(1);
    const loading = ref(false);
    const error = ref(null);
    let allLostCases = []; // 用於存儲所有案件，以便分頁切換

    // 取得會員的遺失案件
    const fetchLostCases = async () => {
        loading.value = true;
        error.value = null;
        try {
            const response = await LostCaseAPI.getLostCases(memberId);
            allLostCases = response.data;

            // 按照 `publicationTime` 降冪排序，確保最新的案件排在最前面
            allLostCases.sort((a, b) => new Date(b.publicationTime) - new Date(a.publicationTime));

            // 計算總頁數
            totalPages.value = Math.ceil(allLostCases.length / pageSize);

            // 設定當前頁面顯示的案件
            updatePage(1);
        } catch (err) {
            error.value = "❌ 獲取遺失案件失敗，請重試";
            console.error("❌ 獲取遺失案件失敗:", err);
        } finally {
            loading.value = false;
        }
    };

    // 分頁控制
    const updatePage = (page) => {
        if (page < 1 || page > totalPages.value) return;
        currentPage.value = page;

        // 計算分頁範圍
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        losts.value = allLostCases.slice(start, end);
    };

    // 跳轉到指定頁面
    const goToPage = (page) => {
        updatePage(page);
    };

    // 取得單筆案件資訊
    const fetchLostCaseById = async (lostCaseId) => {
        try {
            const response = await LostCaseAPI.getLostCaseById(lostCaseId);
            return response.data;
        } catch (err) {
            console.error("❌ 查詢案件失敗:", err);
            throw new Error("查詢案件失敗");
        }
    };

    // 新增遺失案件
    const createLostCase = async (lostCaseData) => {
        try {
            await LostCaseAPI.createLostCase(lostCaseData);
            fetchLostCases(); // 重新載入列表
        } catch (err) {
            console.error("❌ 創建案件失敗:", err);
            throw new Error("創建案件失敗");
        }
    };

    // 更新案件
    const updateLostCase = async (lostCaseId, updateData) => {
        try {
            await LostCaseAPI.updateLostCase(lostCaseId, updateData);
            fetchLostCases(); // 重新載入列表
        } catch (err) {
            console.error("❌ 更新案件失敗:", err);
            throw new Error("更新案件失敗");
        }
    };

    // 刪除案件
    const deleteLostCase = async (lostCaseId) => {
        try {
            await LostCaseAPI.deleteLostCase(lostCaseId);
            fetchLostCases(); // 重新載入列表
        } catch (err) {
            console.error("❌ 刪除案件失敗:", err);
            throw new Error("刪除案件失敗");
        }
    };

    // 頁面載入時執行
    onMounted(fetchLostCases);

    return {
        losts,
        currentPage,
        totalPages,
        pageSize,
        loading,
        error,
        fetchLostCases,
        goToPage,
        fetchLostCaseById,
        createLostCase,
        updateLostCase,
        deleteLostCase
    };
}