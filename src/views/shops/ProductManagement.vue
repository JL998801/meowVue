<template>
    <!-- 讓 container 佔滿剩餘空間 -->
    <div class="container-fluid content">

        <!-- 🔹 標題、搜尋欄、新增按鈕 (統一佈局) -->
        <div class="d-flex justify-content-between align-items-center mb-3 header-container">
            
            <!-- ✅ 商品管理標題 (左側) -->
            <h2 class="page-title">商品管理</h2>

            <!-- ✅ 搜尋欄 -->
            <div class="search-bar">
                <input v-model="searchQuery" type="text" class="form-control" placeholder="輸入商品關鍵字..." @keyup.enter="applyFilter" />
            </div>

            <div class="pagination">
                <Pagination 
                v-if="productStore.totalPages"
                />
            </div>

            <!-- ✅ 新增商品按鈕 -->
            <!-- 引入 Modal 組件 -->
            <ProductFormModal ref="productFormRef" @close="closeModal" />
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#productFormModal">
            <!-- <button class="btn btn-success add-product-btn" @click="addProduct"> -->
                + 新增商品
            </button>
        </div>

        <!-- 商品列表 -->
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">編號</th>
                    <th scope="col">圖片</th>
                    <th scope="col">名稱</th>
                    <th scope="col">分類</th>
                    <th scope="col">標籤</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">庫存數量</th>
                    <th scope="col">單位</th>
                    <!-- <th scope="col">描述</th> -->
                    <th scope="col">到期日</th>
                    <th scope="col">建立時間</th>
                    <th scope="col">更新時間</th>
                    <th scope="col">狀態</th>
                    <th scope="col" ></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in productStore.products" :key="product.productId">
                    <!-- 編號 -->
                    <td>{{ product.productId }}</td>

                    <!-- 圖片 -->
                    <td>
                        <div class="image-gallery">
                            <figure class="figure">
                                <!-- 🔹 顯示模式 (不可修改) -->
                                <template v-if="!editMode[product.productId]">
                                    <img
                                        :src="product.imageUrls.length > 0 ? product.imageUrls[0] : placeholderImage"
                                        alt="主商品圖片"
                                        class="figure-img img-fluid main-image"
                                    />
                                    <!-- <div class="thumbnail-container">
                                        <img
                                            v-for="(image, index) in product.imageUrls.slice(1, 5)"
                                            :key="index"
                                            :src="image"
                                            :alt="`商品圖片 ${index + 1}`"
                                            class="figure-img img-fluid thumbnail"
                                        />
                                    </div> -->
                                </template>

                                <!-- 🔹 編輯模式 (可更換圖片) -->
                                <template v-else>
                                    <!-- 主圖 (可點擊更換) -->
                                    <label class="upload-label">
                                        <img
                                            :src="product.imageUrls.length > 0 ? product.imageUrls[0] : placeholderImage"
                                            alt="主商品圖片"
                                            class="figure-img img-fluid main-image"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            class="d-none"
                                            @change="handleImageUpload($event, product, 0)"
                                        />
                                    </label>

                                    <!-- 其他圖片 (最多 4 張，可更換) -->
                                    <div class="thumbnail-container">
                                        <!-- <label v-for="(image, index) in product.imageUrls.slice(1, 5)" :key="index" class="upload-label">
                                            <img
                                                :src="image"
                                                :alt="`商品圖片 ${index + 1}`"
                                                class="figure-img img-fluid thumbnail"
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                class="d-none"
                                                @change="handleImageUpload($event, product, index + 1)"
                                            />
                                        </label> -->
                                        <!-- 如果圖片不足 4 張，補上空白可上傳 -->
                                        <!-- <label v-for="i in Math.max(0, 4 - (product.imageUrls.length - 1))"
                                            :key="'placeholder' + i"
                                            class="thumbnail placeholder upload-label">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                class="d-none"
                                                @change="handleImageUpload($event, product, product.imageUrls.length)"
                                            />
                                        </label> -->
                                    </div>
                                </template>
                            </figure>
                        </div>
                    </td>

                    <!-- 名稱 -->
                    <td v-if="!editMode[product.productId]" class="product-name">{{ product.productName }}</td>
                    <td v-else><input type="text" v-model="product.productName" class="form-control" /></td>

                    <!-- 分類 -->
                    <td v-if="!editMode[product.productId]">
                        {{ product.category?.categoryName || "無分類" }}
                    </td>
                    <td v-else class="editable-cell">
                        <div class="select-wrapper">
                            <select v-model="product.categoryId" class="form-select custom-select">
                            <option v-for="category in categoryStore.categories" :value="category.categoryId">
                                {{ category.categoryName }}
                            </option>
                            </select>
                        </div>
                    </td>

                    <!-- 標籤 -->
                    <td v-if="!editMode[product.productId]" class="tag-cell">
                        <span v-for="tag in product.tags || []" :key="tag.tagId" class="badge bg-primary me-1">
                            {{ tag.tagName }}
                        </span>
                    </td>
                    <td v-else>
                        <!-- 父組件（ProductList.vue） -->
                        <TagModal ref="tagModalRef" />
                        <button class="btn btn-outline-primary" @click="tagModalRef.openModal(product)">
                        選擇標籤
                        </button>
                    </td>

                    <!-- 原價 -->
                    <td v-if="!editMode[product.productId]">{{ product.originalPrice }}</td>
                    <td v-else><input type="number" v-model="product.originalPrice" class="form-control" /></td>

                    <!-- 售價 -->
                    <td v-if="!editMode[product.productId]">{{ product.salePrice }}</td>
                    <td v-else><input type="number" v-model="product.salePrice" class="form-control" /></td>

                    <!-- 庫存 -->
                    <td v-if="!editMode[product.productId]">{{ product.stockQuantity }}</td>
                    <td v-else><input type="number" v-model="product.stockQuantity" class="form-control" /></td>

                    <!-- 單位 -->
                    <td v-if="!editMode[product.productId]">{{ product.unit }}</td>
                    <td v-else><input type="text" v-model="product.unit" class="form-control" /></td>

                    <!-- 商品描述 -->
                    <!-- <td v-if="!editMode[product.productId]"  class="product-description">{{ product.description }}</td>
                    <td v-else><textarea v-model="product.description" class="form-control"></textarea></td> -->

                    <!-- 到期日 -->
                    <td v-if="!editMode[product.productId]">{{ product.expire }}</td>
                    <td v-else><input type="date" v-model="product.expire" class="form-control" /></td>

                    <!-- 建立時間(自動更新) -->
                    <td class="date-time-cell">{{ formatDate(product.createdAt) }}</td>

                    <!-- 更新時間(自動更新) -->
                    <td class="date-time-cell">{{ formatDate(product.updatedAt) }}</td>

                    <!-- 狀態 -->
                    <td v-if="!editMode[product.productId]">{{ product.status }}</td>
                    <td v-else class="editable-cell">
                        <div class="select-wrapper">
                            <select v-model="product.status" class="form-select custom-select">
                                <option value="上架中">上架中</option>
                                <option value="下架">下架</option>
                            </select>
                        </div>
                    </td>

                    <td>
                        <div class="action-buttons">
                            <button
                                class="btn"
                                :class="editMode[product.productId] ? 'btn-success' : 'btn-primary'"
                                @click="editMode[product.productId] ? saveProduct(product) : modifyProduct(product.productId)"
                            >
                                {{ editMode[product.productId] ? '儲存' : '修改' }}
                            </button>
                            <button v-if="editMode[product.productId]" class="btn btn-secondary ms-2" @click="cancelEdit(product.productId)">
                                取消
                            </button>
                            <button v-else class="btn btn-danger ms-2" @click="deleteProduct(product.productId)">刪除</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";
import ProductFormModal from "@/components/shop/manage/ProductFormModal.vue";
import TagModal from "@/components/shop/manage/TagModal.vue";
import Pagination from "@/components/shop/home/Pagination11.vue";
import useProductStore from "@/stores/productStore";
import useCategoryStore from "@/stores/categoryStore";
import useTagStore from "@/stores/productTagStore";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore();
const searchQuery = ref("");
const originalProductData = ref({}); // 備份原始商品數據（當修改狀態下，用戶取消編輯時回到原始狀態）

const editMode = ref({}); // 追蹤每個 product 是否處於編輯狀態
const placeholderImage = "https://via.placeholder.com/100"; // 預設空白圖片

const selectedTags = ref([]); // 存放選中的標籤

// ✅ 格式化日期函數: 建立時間、更新時間
const formatDate = (dateString) => {
    if (!dateString) return "無"; // 若日期不存在，顯示 "無"
    const date = new Date(dateString);
    
    const pad = (num) => String(num).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}\n${hours}:${minutes}:${seconds}`;
};

// ✅ 點擊搜尋按鈕時調用 `fetchFilteredProducts` 並發送事件**
const applyFilter = async () => {
    const filter = {
        query: searchQuery.value || null,
    };
    console.log("🔍 送出的完整請求:", JSON.stringify(filter, null, 2)); 
    try {
        await productStore.fetchFilteredProducts(filter);
        // emit("update-filter", filter); // ✅ 通知父組件更新篩選條件
        console.log("🔍篩選條件已應用", filter);
        console.log("🔍 篩選後的商品:", productStore.filteredProducts);
    } catch (error) {
        console.error("篩選商品失敗", error);
    }
};

// ✅ 新增商品: 打開 ProductFormModal 彈窗
const productFormRef = ref(null);

// 打開 Modal
const addProduct = () => {
    if (productFormRef.value) {
        productFormRef.value.openModal();
    } else {
        console.error("ProductFormModal 未載入");
    }
};

// ✅ 修改商品: 每個欄位開放調整，備份一份原始數據供"取消"操作時恢復資料 */
const modifyProduct = (productId) => {
    editMode.value[productId] = true;

    // 備份原始數據（確保每個 `productId` 都有對應的備份）
    originalProductData.value[productId] = JSON.parse(JSON.stringify(productStore.products.find(p => p.productId === productId)));
};

// 新增商品完成後，自動關閉 Modal
const closeModal = () => {
  const modalElement = document.getElementById("productFormModal");
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide(); // ✅ 使用 Bootstrap API 手動關閉 Modal
  }
};

//  修改商品圖片
const handleImageUpload = (event, product, index) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        // 取得 base64 預覽圖，先更新畫面
        if (index < product.imageUrls.length) {
            product.imageUrls[index] = e.target.result;
        } else {
            product.imageUrls.push(e.target.result);
        }

        // 存儲要上傳的圖片
        if (!product.selectedImages) product.selectedImages = [];
        product.selectedImages.push({ file, index });
    };
    reader.readAsDataURL(file);
};

/** 確認選項是否已選中:確保 product.tags 一定是數組，並增加 null 檢查 */
const isSelected = (product, option) => {
    return Array.isArray(product.tags) && product.tags.some(tag => tag.tagId === option.tagId);
};

/** 切換標籤選擇狀態 */
const toggleTag = (product, option) => {
    if (!Array.isArray(product.tags)) {
        product.tags = []; // 確保是陣列，避免 undefined 錯誤
    }

    const index = product.tags.findIndex(tag => tag.tagId === option.tagId);
    if (index === -1) {
        product.tags.push(option); // ✅ 如果沒選，就加入
    } else {
        product.tags.splice(index, 1); // ✅ 如果已選，就移除
    }
};

// 取消編輯，恢復原始數據 */
const cancelEdit = (productId) => {
    if (originalProductData.value[productId]) {
        // 找到該商品在 `productStore.products` 陣列中的索引
        const index = productStore.products.findIndex(p => p.productId === productId);
        if (index !== -1) {
            // 還原原始數據
            productStore.products[index] = JSON.parse(JSON.stringify(originalProductData.value[productId]));
        }
    }

    // 清除備份
    delete originalProductData.value[productId];

    // 關閉編輯模式
    editMode.value[productId] = false;
};

/* 儲存變更 */
const saveProduct = async (product) => {
    console.log("🔄 儲存商品:", product);

    const updatedData = {
        productName: product.productName,
        categoryId: product.categoryId,
        tags: productStore.selectedTags[product.productId], // 改為從 store 讀取 selectedTags
        expire: product.expire,
        originalPrice: product.originalPrice,
        salePrice: product.salePrice,
        stockQuantity: product.stockQuantity,
        unit: product.unit,
        description: product.description,
        status: product.status,
    };

    const images = product.selectedImages || [];

    try {
        const success = await productStore.modifyProduct(product.productId, updatedData);
    if (success) {
        Swal.fire({ title: "修改成功!", text: "成功修改商品資訊。", icon: "success" });
         editMode.value[product.productId] = false;
    } else {
         throw new Error("部分更新失敗");
    }
    } catch (error) {
        Swal.fire({ title: "修改失敗!", text: "發生錯誤，請稍後再試。", icon: "error" });
    }

    // try {
    //     // ✅ 先判斷是否要更新商品資訊
    //     if (Object.keys(updatedData).length > 0) {
    //         const productUpdateSuccess = await productStore.modifyProduct(product.productId, updatedData);
    //         if (!productUpdateSuccess) {
    //             updateSuccess = false;
    //         }
    //     }

    //     // ✅ 再判斷是否要更新圖片
    //     if (images.length > 0) {
    //         const imageUpdateSuccess = await productStore.updateImages(product.productId, images);
    //         if (!imageUpdateSuccess) {
    //             updateSuccess = false;
    //         }
    //     }

         // ✅ 再上傳圖片
        // if (product.selectedImages && product.selectedImages.length > 0) {
        //     const formData = new FormData();
        //     product.selectedImages.forEach(({ file, index }) => {
        //         formData.append(`image_${index}`, file);
        //     });

        //     const imageUpdateSuccess = await productStore.updateImages(product.productId, formData);
        //     if (!imageUpdateSuccess) {
        //         updateSuccess = false;
        //     }
        // }

        // ✅ 結果處理
    //     if (updateSuccess) {
    //         Swal.fire({
    //             title: "修改成功!",
    //             text: "成功修改商品資訊。",
    //             icon: "success",
    //             timer: 2000,
    //             showConfirmButton: false,
    //             timerProgressBar: true
    //         });

    //         editMode.value[product.productId] = false; // 關閉編輯模式
    //     } else {
    //         throw new Error("部分更新失敗");
    //     }
    // } catch (error) {
    //     console.error("🔴 商品修改失敗:", error);
    //     Swal.fire({
    //         title: "修改失敗!",
    //         text: "發生錯誤，請稍後再試。",
    //         icon: "error"
    //     });
    // }
};

// ✅ 刪除商品: 跳出提醒訊息
const deleteProduct = async (id) => {
    const result = await Swal.fire({
        title: "確定刪除此筆商品嗎?",
        text: "若還想保留商品交易資訊，請取消此操作",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "確認刪除",
        cancelButtonText: "取消",
        reverseButtons: true,
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
            actions: "swal-buttons-container"
        },
        buttonsStyling: false
    });

    if (result.isConfirmed) {
        try {
            const response = await productStore.deleteProduct(id); // ✅ 執行刪除請求
            if (response && response.success) {
                await productStore.fetchProducts(); // ✅ 確保 UI 及時更新
                
                await Swal.fire({
                    title: "刪除成功!",
                    text: response.message || "商品刪除成功",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true
                });
            } else {
                throw new Error(response?.message || "刪除失敗，請稍後再試。");
            }
        } catch (error) {
            console.error("刪除商品失敗:", error);
            await Swal.fire({
                title: "刪除失敗!",
                text: error.message || "發生錯誤，請稍後再試。",
                icon: "error"
            });
        }
    } else {
        await Swal.fire({
            title: "取消刪除",
            text: "商品仍然保留。",
            icon: "info"
        });
    }
};

onMounted(() => {
    productStore.fetchProducts();
    categoryStore.fetchCategories();
    tagStore.fetchTags();
    console.log("ProductFormModal ref:", productFormRef.value); // ✅ 檢查是否為 null；"新增商品"談窗掛載後才被訪問
});
</script>

<style scoped>
/* 隱藏滾動條但允許滾動 */
html, body {
    overflow: auto; /* ✅ 允許滾動 */
    scrollbar-width: none; /* ✅ 隱藏 Firefox 滾動條 */
    -ms-overflow-style: none; /*✅ 隱藏 IE/Edge 滾動條*/
}

body::-webkit-scrollbar {
    display: none; /* ✅ 隱藏 Chrome/Safari 滾動條 */
}

.page-title{
    margin-left: 30px;
    font-weight: bold;
}

/* ✅ 讓標題、搜尋欄、新增按鈕在同一行 */
.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 15px;
    border-radius: 90px;
}
.table{
    width: 100%;
    border-radius: 50px; /* 讓邊框成為橢圓形 */
    border: #dfe2e6;
    overflow: visible; /*允許內容超出 `table` 顯示*/
    border-collapse: collapse !important; /*跳過 Bootstrap 背景色限制 */
    /* table-layout: auto; 允許表格根據內容調整寬度 */
    table-layout: fixed; /* ✅ 強制表格按照指定寬度分配 */
}

.table th{
    background-color: #d0ccd0;
    border: #dfe2e6;
    color: #000000;
}

/* 表頭、列、欄 */
.table th,
.table tr,
.table td {
    position: relative; /*✅ 讓 `td` 內部可以顯示超出的內容；Multiselect` 的相對參照 */
    text-align: center;
    overflow: visible !important; /*✅ 允許 `Multiselect` 顯示*/
    vertical-align: middle;
    white-space: nowrap; /* ✅ 除非 `textarea`，否則不允許換行 */
    /* overflow: hidden; ✅ 避免表格變形，但允許內容顯示(除了到期日欄位) */
    height: auto; /* ✅ 允許 `td` 在 `editMode` 時增高 */
}

/* 商品描述欄位 */
.fixed-width{
    width: 100px; /* 固定寬度 */
    overflow: hidden; /* 隱藏超出的文字 */
    white-space: nowrap; /* 禁止換行 */
    text-overflow: ellipsis; /* 超出時顯示省略號 */
}

/* 商品名稱 */
td.product-name {
    max-width: 150px; /* 固定寬度 */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/* 商品描述 */
td.product-description {
    max-width: 200px; /* ✅ 確保固定寬度 */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block; /* ✅ 確保 `text-overflow` 有效 */
}


/* 設定固定寬度（可根據實際內容調整） */
th:nth-child(1), td:nth-child(1) { width: 50px; }  /* 商品編號 */
th:nth-child(2), td:nth-child(2) { width: 150px; } /* 商品圖片 */
th:nth-child(3), td:nth-child(3) { width: 150px; } /* 名稱 */
th:nth-child(4), td:nth-child(4) { width: 100px; } /* 分類 */
th:nth-child(5), td:nth-child(5) { width: 100px; } /* 標籤 */
th:nth-child(6), td:nth-child(6) { width: 90px; } /* 原價 */
th:nth-child(7), td:nth-child(7) { width: 90px; } /* 售價 */
th:nth-child(8), td:nth-child(8) { width: 90px; } /* 庫存數量 */
th:nth-child(9), td:nth-child(9) { width: 60px; } /* 單位 */
th:nth-child(10), td:nth-child(10) { width: 200px; } /* 描述 */
th:nth-child(11), td:nth-child(11) { width: 130px; } /* 到期日 */
th:nth-child(12), td:nth-child(12) { width: 100px; } /* 建立時間 */
th:nth-child(13), td:nth-child(13) { width: 100px; } /* 更新時間 */
th:nth-child(14), td:nth-child(14) { width: 80px; } /* 狀態 */
th:nth-child(15), td:nth-child(15) { width: 150px; } /* 操作按鈕 */

/* 下拉選單通用: 類別、標籤、狀態 */
td .form-select {
    position: relative; /* ✅ 讓 Multiselect 內容不會被 `td` 限制 */
    box-sizing: border-box;
    width: 100%;
    min-width: 120px; /* ✅ 防止過小 */
    max-width: 100%; /* ✅ 不讓它超過 td */
    z-index: 9999;  /* ✅ 確保 `dropdown` 不被 `td` 遮擋 */
}

/* ✅ 讓 `form-select`（單選類別）懸浮於 `td` 上方 */
td .form-select:focus {
    position: absolute;
    z-index: 9999;
    width: auto; /* ✅ 讓寬度自適應，但不超過 `td` */
    min-width: 100%;
    max-width: 200px; /* ✅ 限制最大寬度 */
}

/* ✅ 修正 `focus` 時可能導致的超出 */
.custom-select:focus {
    outline: none;
    box-shadow: none;
}

/* ✅ 避免 select 被表格內容擠壓 */
td.editable-cell .custom-select {
    display: block;
    width: 100%;
}

/* ✅ 設置包裹 select 的 div */
.select-wrapper {
    width: 100%; /* 讓 div 佔滿 td */
    display: flex; /* 讓 select 不超出 */
    align-items: center; /* 保持垂直對齊 */
}

/* ✅ 自訂 select 樣式，確保與 td 對齊 */
.custom-select {
    position: relative !important;
    z-index: 1000 !important;
    width: 100%; /* 讓 select 填滿 td */
    min-width: 80px; /* 避免 select 太小 */
    max-width: 100%; /* 不讓 select 超出 td */
    height: 30px; /* 控制高度 */
    font-size: 14px;
    border-radius: 5px;
    box-sizing: border-box;
    /* overflow: hidden; ✅ 確保 select 不會溢出 */
}

/* ✅ 確保標籤欄位的 `td` 允許內容顯示 */
td.tag-cell {
    position: relative; /* 讓 Multiselect 能正確渲染 */
    overflow: visible !important; /* 確保選單不會被 `td` 裁切 */
    white-space: normal; /* 允許內容換行 */
}

/* ✅ 讓 `checkbox` 間距更清晰 */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* ✅ 讓建立時間、更新時間的 td 內容允許換行 */
td.date-time-cell {
    font-size: small;
    white-space: pre-line; /* ✅ 允許換行 */
    text-align: center; /* ✅ 置中對齊 */
}

/* 其他欄位 */
.form-control {
    position: relative;  /* ✅ 讓 `select` 內容完整顯示 */
    z-index: 10;
    width: 100%; /* ✅ 讓 `input` 佔滿 `td` 但不超過 */
    max-width: 100%; /* ✅ 限制最大寬度 */
    box-sizing: border-box; /* ✅ 避免 padding 影響大小 */
    padding: 5px; /* ✅ 讓輸入框內文字不會擠壓 */
    margin: 0 auto; /* ✅ 讓輸入框水平置中 */
    border: 1px solid #ced4da; /* ✅ 統一邊框 */
    background-color: white; /* ✅ 確保輸入框不被隱藏 */
    display: block;
}

/* ✅ 讓 `textarea` 不影響其他欄位，但可以多行輸入 */
textarea {
    width: 100%;
    min-height: 40px;
    resize: vertical; /* ✅ 允許上下調整 */
    max-height: 120px; /* ✅ 限制最大高度 */
}

/* ✅ 允許 `過期日期` 內容超過時換行，但不影響其他欄位 */
td.expire-cell {
    white-space: normal; /* ✅ 允許換行 */
}



/* 搜尋欄樣式 */
.search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    border-radius: 999px; /* 讓搜尋欄成為橢圓形 */
    padding: 12px 20px; /* 增加內間距，讓高度更有橢圓感 */
    background-color: #fff; /* 白色背景 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* 添加柔和陰影 */
    border: 1px solid #ddd; /* 淺色邊框，讓圓角更明顯 */
    width: 100%; /* 讓搜尋欄適應父級容器 */
    max-width: 500px; /* 設定最大寬度 */
}

/* 輸入框的樣式 */
.search-bar input {
    flex: 1; /* 讓輸入框自適應寬度 */
    border: none;
    outline: none;
    border-radius: 999px; /* 讓輸入框也是橢圓形 */
    padding: 10px 16px;
    font-size: 16px;
    background: transparent; /* 讓背景與 `.search-bar` 保持一致 */
}

/* 🔹 調整 SweetAlert2 內按鈕間距 */
.swal-buttons-container {
  display: flex;
  justify-content: center;
  gap: 20px; /* 🔹 調整按鈕間距 */
}

/* 讓 image-gallery 充滿 td */
.image-gallery {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%; /* 讓 image-gallery 填滿 <td> */
    width: 100%;
    overflow: hidden; /* 防止超出 */
}

/* 讓 figure 填滿 image-gallery */
.figure {
    display: flex;
    align-items: center;
    justify-content: space-between; /*讓主圖和縮圖不重疊 */
    gap: 10px;
    height: 100%;
    width: 100%;
}

/* 讓上傳圖片的 label 具有點擊效果 */
.upload-label {
    cursor: pointer;
    display: inline-block;
    position: relative;
}

/* 讓預留的空白區塊可點擊上傳 */
.placeholder {
    width: 100%;
    height: 50px;
    background-color: #f9f9f9;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 限制按鈕的 `td` 最小寬度，確保不被壓縮 */
td:last-child {
    min-width: 150px; /* 確保按鈕列有足夠的空間 */
    text-align: center;
    white-space: nowrap; /* 避免按鈕換行 */
}

/* 讓 `input` / `select` 在編輯模式下不影響按鈕空間 */
td select,
td textarea {
  width: 100%; /* 讓輸入框填滿 `td` */
  min-width: 100px; /* 防止輸入框變得太小 */
  max-height: 120px; /* ✅ 限制最大高度 */
  resize: vertical; /* ✅ 允許上下縮放，但不能擠壓橫向欄位 */
}

/* input欄位: 原價、售價、庫存、單位 */
td input{

}

/* 讓按鈕不會被壓縮 */
td .btn {
    padding: 5px 10px; /* 控制按鈕大小 */
    margin: 2px; /* 確保按鈕間有間距 */
    white-space: nowrap; /* 避免按鈕換行 */
    display: inline-block;
}

</style>