import { defineStore } from "pinia";
import { ProductTagService } from "@/services/ProductTagService";
import Swal from "sweetalert2";
import { ref } from "vue";

const useProductTagStore = defineStore("productTag", {
    state: () => ({
        tags: [],
        selectedTags:[],
    }),

    actions: {
        async fetchTags() {
            try {
                const response = await ProductTagService.getAllTags();
        
                // ✅ 確保 response 存在且成功
                if (response?.success && Array.isArray(response.tags)) {
                    this.tags = response.tags;
                } else {
                    console.warn("⚠️ API 回傳錯誤或 tags 不是陣列:", response);
                    this.tags = []; // 確保 tags 為陣列，防止 Multiselect 錯誤
                }
            } catch (error) {
                console.error("❌ 標籤獲取失敗:", error);
                this.tags = []; // 確保 tags 永遠是陣列
                Swal.fire({
                    icon: "error",
                    title: "載入標籤失敗",
                    text: "無法獲取標籤，請稍後再試。",
                });
            }
        },
        setSelectedTags(tags) {
            this.selectedTags = tags; // ✅ 更新選擇的標籤
        },   
    }
});
export default useProductTagStore;