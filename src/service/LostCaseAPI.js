import {axiosapi} from "@/plugins/axios.js";

export default {
    /**
     * 取得會員發布的遺失案件
     * @param {Number} memberId 會員 ID
     * @returns {Promise} API 回應
     */
    getLostCases(memberId) {
        if (!memberId || isNaN(memberId)) {
            console.error("❌ API 錯誤: `memberId` 無效", memberId);
            return Promise.reject("memberId 無效");
        }
        return axiosapi.get(`/lostcases/member/${memberId}`);
    },

    /**
     * 根據案件 ID 取得單一遺失案件的詳細資訊
     * @param {Number} lostCaseId 遺失案件 ID
     * @returns {Promise} API 回應
     */
    getLostCaseById(lostCaseId) {
        return axiosapi.get(`/lostcases/${lostCaseId}`);
    },

    /**
     * 創建新的遺失案件，並自動創建對應的 Banner
     * @param {Object} lostCaseData 遺失案件的 JSON 資料
     * @returns {Promise} API 回應
     */
    createLostCase(lostCaseData) {
        return axiosapi.post(`/lostcases/create`, lostCaseData);
    },

    /**
     * 更新指定的遺失案件資訊
     * @param {Number} lostCaseId 遺失案件 ID
     * @param {Object} updateData 需要更新的 JSON 資料
     * @returns {Promise} API 回應
     */
    updateLostCase(lostCaseId, updateData) {
        return axiosapi.put(`/lostcases/${lostCaseId}`, updateData);
    },

    /**
     * 根據 ID 刪除遺失案件，並刪除對應的 Banner
     * @param {Number} lostCaseId 遺失案件 ID
     * @returns {Promise} API 回應
     */
    deleteLostCase(lostCaseId) {
        return axiosapi.delete(`/lostcases/${lostCaseId}`);
    },

    /**
     * 查詢符合條件的遺失案件（支援模糊查詢、分頁與排序）
     * @param {Object} searchParams 查詢參數
     * @returns {Promise} API 回應
     */
    searchLostCases(searchParams) {
        return axiosapi.post(`/lostcases/search`, searchParams);
    }
};
