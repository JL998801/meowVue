import { defineStore } from "pinia";
import { CategoryService } from "@/services/CategoryService";
import Swal from "sweetalert2";

const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [], // ✅ 存放所有分類
  }),

  actions: {
    // ✅ 取得所有分類
    async fetchCategories() {
      try {
        const response = await CategoryService.getAllCategories();
        this.categories = response?.categories ?? []; // ✅ 確保只存 `categories`
        // console.log("獲取的 categories:", JSON.stringify(this.categories, null, 2));
      } catch (error) {
        console.error("無法獲取商品分類:", error);
        this.categories = []; // 避免前端報錯
        Swal.fire({
          icon: "error",
          title: "載入失敗",
          text: errorMessage.value,
        });
      }
    },
  },
});
export default useCategoryStore;
