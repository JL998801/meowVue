import { defineStore } from "pinia";
import { ProductTagService } from "@/services/ProductTagService";

export const useProductTagStore = defineStore("productTag", {
state: () => ({
    tags: []
}),

actions: {
    async fetchTags() {
        try {
            this.tags = await ProductTagService.getAllTags();
            console.log("載入的 tags:", this.tags);
        } catch (error) {
            console.error("標籤獲取失敗:", error);
        }
    }
}
});
