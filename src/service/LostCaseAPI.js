import axiosapi from "@/plugins/axios.js";

export default {
    getLostCases(memberId) {
        return axiosapi.get(`/lostcases/member/${memberId}`);
    },

    getLostCaseById(lostCaseId) {
        return axiosapi.get(`/lostcases/${lostCaseId}`);
    },

    createLostCase(lostCaseData) {
        return axiosapi.post(`/lostcases/create`, lostCaseData);
    },

    updateLostCase(lostCaseId, updateData) {
        return axiosapi.put(`/lostcases/${lostCaseId}`, updateData);
    },

    searchLostCases(searchParams) {
        return axiosapi.post(`/lostcases/search`, searchParams);
    },

    // **新增取得所有遺失案件的方法**
    getAllLostCases() {
        return axiosapi.get(`/lostcases`);
    }
};
