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
        this.categories = await CategoryService.getAllCategories();
    } catch (error) {
        console.error("無法獲取商品分類:", error);
    }
    }
}
});
