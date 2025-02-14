import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        memberId: null, // 儲存會員 ID
    }),
    actions: {
        setMemberId(id) {
            this.memberId = id;
        },
    },
});