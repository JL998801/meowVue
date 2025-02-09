import { defineStore } from "pinia";
import { ProductTagService } from "@/services/ProductTagService";
import Swal from "sweetalert2";

const useProductTagStore = defineStore("productTag", {
    state: () => ({
        tags: []
    }),

    actions: {
        async fetchTags() {
            try {
                const response = await ProductTagService.getAllTags();
                this.tags = response?.tags ?? []; // ✅ 確保只存 `tags`
                console.log("獲取的 tags:", JSON.stringify(this.tags, null, 2));
            } catch (error) {
                console.error("標籤獲取失敗:", error);
                this.tags = []; // ✅ 確保不會變 undefined
                Swal.fire({
                    icon: "error",
                    title: "載入失敗",
                    text: error.message,
                  });
            }
        }
    }
});
export default useProductTagStore;