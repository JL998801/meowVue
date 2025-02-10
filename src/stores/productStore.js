import { defineStore } from 'pinia'
import {ref} from 'vue'
import { ProductService } from "@/services/ProductService";
import Swal from "sweetalert2";

const useProductStore = defineStore("shop", {
    state: () => ({
        products: [],
        filteredProducts: [],
        totalPages: ref(0),
        currentPage: ref(0),
        loading: ref(false),
        errorMessage: ref(null)
    }),
    
    actions: {
        async fetchProducts() {
        try {
            const response = await ProductService.getAllProducts();
        this.products = response?.products ?? [];
        // console.log("獲取的 products:", JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("載入預設商品失敗", error);
            Swal.fire({
                icon: "error",
                title: "載入失敗",
                text: error.message || "發生未知錯誤",
            });
        }},

        // ✅ 獲取分頁商品列表
        async fetchPagedProducts(page = 0, size = 10, sortBy = "productName", order = "asc") {
            loading.value = true;
            errorMessage.value = null;
            
            try {
              const response = await ProductService.getPagedProducts(page, size, sortBy, order);
          
              // ✅ 根據 API 回應結構更新變數
              products.value = response.data.content || []; // ✅ 產品數據來自 `content`
              totalPages.value = response.data.totalPages || 0; // ✅ 總頁數
              currentPage.value = response.data.pageable.pageNumber || 0; // ✅ 目前頁碼
              totalProducts.value = response.data.totalElements || 0; // ✅ 總產品數量
          
            } catch (error) {
              console.error("獲取商品失敗:", error);
              errorMessage.value = "無法獲取商品列表，請稍後再試。";
            } finally {
              loading.value = false;
            }
        },
          

        // ✅ 動態查詢: 商品名稱+價格區間+類別
        async fetchFilteredProducts(filter) {
            try {
            const response = await ProductService.searchProducts(filter);
            if (response.success) {
                this.filteredProducts = response.products || [];
            } else {
                this.filteredProducts = [];
            }
            } catch (error) {
            console.error("篩選商品載入失敗:", error);
            }
        },
    },
});
export default useProductStore;