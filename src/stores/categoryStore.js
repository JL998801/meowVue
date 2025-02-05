import { defineStore } from "pinia";
import { CategoryService } from "@/services/CategoryService";

// pinia負責管理狀態

export const useCategoryStore = defineStore("category", {
state: () => ({
    categories: []
}),
actions: {
    async fetchCategories() {
        try {
            const categories = await CategoryService.getAllCategories();
            
            // 🔹 確保 `categories` 是陣列
            this.categories = Array.isArray(categories) ? categories : [];
    
            console.log("載入的 categories:", this.categories);
        } catch (error) {
            console.error("無法獲取商品分類:", error);
            this.categories = []; // 避免前端報錯
        }
    }    
}
});
