import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ProductService } from "@/services/ProductService";
import Swal from "sweetalert2";

// ✅ 定義響應式狀態 (ref)
const useProductStore = defineStore("shop", () => {
    const products = ref([]); // 產品列表
    const totalPages = ref(0); // 總頁數
    const currentPage = ref(0); // 當前頁
    const totalProducts = ref(0); // 總產品數
    const loading = ref(false); // 是否正在載入
    const errorMessage = ref(null); // 錯誤訊息
    const selectedFilter = ref(null); // 選擇的篩選條件

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

    // ✅ 添加商品
    // async function addProduct(newProduct) {
    //     loading.value = true;
    //     errorMessage.value = null;
    
    //     try {
    //         const formData = new FormData();
    
    //         // 將 `productRequest` 轉為 JSON 字串
    //         formData.append("productRequest", JSON.stringify(newProduct));
    
    //         // 添加圖片檔案
    //         if (newProduct.productImages) {
    //             newProduct.productImages.forEach((file) => {
    //                 formData.append("productImages", file);
    //             });
    //         }
    
    //         // 發送請求，確保 `Content-Type` 為 `multipart/form-data`
    //         const response = await axios.post("http://localhost:8080/api/products", formData, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //                 "Authorization": `Bearer ${userStore.token}`, // 確保攜帶 `token`
    //             },
    //         });
    
    //         if (response.data.success) {
    //             products.value.push(response.data.product);
    //             Swal.fire("成功", "商品已成功新增！", "success");
    //         } else {
    //             throw new Error(response.data.message || "新增失敗");
    //         }
    //     } catch (err) {
    //         errorMessage.value = "添加商品失敗：" + err.message;
    //         Swal.fire("錯誤", errorMessage.value, "error");
    //     } finally {
    //         loading.value = false;
    //     }
    // }

    async function addProduct(newProduct) {
        try {
            const createdProduct = await ProductService.addProduct(newProduct);
            this.products.push(createdProduct); // **新增後即時更新 state**
            return createdProduct;
        } catch (error) {
            throw error;
        }
    }
    
    // ✅ 刪除商品
    async function deleteProduct(id) {
        try {
            const response = await ProductService.deleteProducts(id); // 🔹 呼叫 API
            if (response.success) {
                products.value = products.value.filter(product => product.productId !== id); // 🔹 UI 同步移除
                return response;
            } else {
                throw new Error(response.message || "刪除失敗");
            }
        } catch (err) {
            console.error("刪除商品失敗:", err);
            return { success: false, message: err.message };
        }
    }

    // ✅ 修改商品欄位 (圖片欄位單獨處理)
    async function modifyProduct(id, productData, productImages = []) {
        try {
            // ✅ 先更新商品資訊
            const response = await ProductService.modifyProducts(id, productData);
            console.log("✅ 商品資訊更新成功:", response);
    
            if (response && response.success) { 
                // ✅ 如果有新圖片要上傳，則呼叫 `updateImages`
                if (productImages.length > 0) {
                    const imageUploadSuccess = await updateImages(id, productImages);
                    if (!imageUploadSuccess) {
                        console.error("⚠️ 圖片更新失敗");
                        return false;
                    }
                }
                return true;
            } else {
                console.error("⚠️ 修改商品 API 失敗:", response);
                return false;
            }
        } catch (error) {
            console.error("🔴 修改商品失敗:", error);
            return false;
        }
    }    

    // 修改商品圖片
    async function updateImages(id, newImages) {
        try {
            const response = await ProductService.updateProductImages(id, newImages);
            if (response.success) {
                Swal.fire("成功!", "商品圖片已更新!", "success");
            } else {
                throw new Error(response.message || "圖片更新失敗");
            }
        } catch (error) {
            Swal.fire("錯誤!", "圖片更新失敗：" + error.message, "error");
        }
    }        

    // ✅ 讓以下方法和參數，可以被 Vue 組件使用
    return {
        products,
        totalPages,
        currentPage,
        totalProducts,
        loading,
        errorMessage,
        selectedFilter,
        fetchProducts,
        fetchPagedProducts,
        fetchFilteredProducts,
        addProduct,
        deleteProduct,
        modifyProduct,
        updateImages,
    };
});

export default useProductStore;
