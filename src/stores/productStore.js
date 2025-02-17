import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ProductService } from "@/services/ProductService";
import Swal from "sweetalert2";

const useProductStore = defineStore("shop", () => {
    // ✅ 定義響應式狀態 (ref)
    const products = ref([]); // ✅ 產品列表
    // const filteredProducts = ref([]); // ✅ 過濾後的產品
    const totalPages = ref(0); // ✅ 總頁數
    const currentPage = ref(0); // ✅ 當前頁
    const totalProducts = ref(0); // ✅ 總產品數
    const loading = ref(false); // ✅ 是否正在載入
    const errorMessage = ref(null); // ✅ 錯誤訊息
    const selectedFilter = ref(null); // ✅ 選擇的篩選條件

    // ✅ 獲取所有商品
    async function fetchProducts() {
        loading.value = true;
        try {
            const response = await ProductService.getAllProducts();
            products.value = response?.products ?? []; // ✅ 使用 `.value`
        } catch (error) {
            console.error("載入預設商品失敗", error);
            Swal.fire({
                icon: "error",
                title: "載入失敗",
                text: error.message || "發生未知錯誤",
            });
        }finally {
            loading.value = false;
        }
    }

    // ✅ 獲取分頁商品列表
    async function fetchPagedProducts(page = 0, size = 12, sortBy = "productName", order = "asc") {
        loading.value = true;
        errorMessage.value = null;
    
        try {
            const data = await ProductService.getPagedProducts(page, size, sortBy, order);
            
            console.log("API 回應:", data);

            products.value = data?.content || []; // ✅ 產品列表
            totalPages.value = data?.totalPages || 0; // ✅ 總頁數
            currentPage.value = data?.pageable?.pageNumber ?? 0; // ✅ 避免 `undefined` 問題
            totalProducts.value = data?.totalElements || 0; // ✅ 總產品數
        } catch (error) {
            console.error("獲取商品失敗:", error);
            errorMessage.value = "無法獲取商品列表，請稍後再試。";
        } finally {
            loading.value = false;
        }
    }

    // ✅ 動態查詢: 商品名稱 + 價格區間 + 類別 + 標籤
    async function fetchFilteredProducts(filter) {
        loading.value = true;
        try {
            selectedFilter.value = filter; // ✅ 更新 `selectedFilter`
            const data = await ProductService.searchProducts(filter);
            console.log("🔍 API 回應:", data);
            
            products.value = data.products || []; // ✅ 直接賦值
            console.log("🔍 篩選結果:", filteredProducts.value);
        } catch (error) {
            console.error("篩選商品失敗", error);
            // filteredProducts.value = []; // ✅ 在錯誤時確保 `filteredProducts` 為空陣列
        }finally {
            loading.value = false;
        }
    }

    return {
        products,
        // filteredProducts,
        totalPages,
        currentPage,
        totalProducts,
        loading,
        errorMessage,
        selectedFilter,
        fetchProducts,
        fetchPagedProducts,
        fetchFilteredProducts
    };
});

export default useProductStore;
