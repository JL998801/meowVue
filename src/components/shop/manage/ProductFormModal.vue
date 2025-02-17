<!-- ✅ ProductFormModal.vue -->
<template>
<div class="modal fade" ref="productModal" id="productFormModal" tabindex="-1" aria-labelledby="productFormLabel" aria-hidden="true">
    <div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="productFormLabel">新增商品</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
        </div>

        <div class="modal-body">
        <form @submit.prevent="submitForm">

            <!-- ✅ 名稱 -->
            <div class="mb-3">
                <label class="form-label">名稱</label>
                <input type="text" class="form-control" v-model="formData.productName" />
            </div>

            <!-- ✅ 分類 -->
            <div class="mb-3">
                <label class="form-label">分類</label>
                <select class="form-select" v-model="formData.categoryId">
                    <option v-for="category in categoryStore.categories" :key="category.categoryId" :value="category.categoryId">
                    {{ category.categoryName }}
                    </option>
                </select>
            </div>

            <!-- ✅ 標籤 -->
            <div class="mb-3">
                <label class="form-label">標籤</label>
                <Multiselect v-model="formData.tags" :options="tagStore.tags" label="tagName" track-by="tagId" multiple placeholder="選擇標籤..." />
            </div>

            <!-- ✅ 原價 -->
            <div class="mb-3">
                <label class="form-label">原價</label>
                <input type="number" class="form-control" v-model="formData.originalPrice" />
            </div>

            <!-- ✅ 售價 -->
            <div class="mb-3">
                <label class="form-label">售價</label>
                <input type="number" class="form-control" v-model="formData.salePrice" />
            </div>

            <!-- ✅ 庫存數量 -->
            <div class="mb-3">
                <label class="form-label">庫存數量</label>
                <input type="number" class="form-control" v-model="formData.stockQuantity" />
            </div>

            <!-- ✅ 單位 -->
            <div class="mb-3">
                <label class="form-label">單位</label>
                <input type="text" class="form-control" v-model="formData.unit" placeholder="請輸入單位" />
            </div>

            <!-- ✅ 描述: 換行使用 shift+enter；按下 Enter 會送出表單-->
            <div class="mb-3">
                <label class="form-label">
                    描述 <span class="input-hint">(換行使用 Shift+Enter)</span>
                </label>
                <textarea 
                    class="form-control" 
                    v-model="formData.description" 
                    @keydown.enter.exact.prevent="submitForm"
                    @keydown.shift.enter="allowNewLine"
                ></textarea>
            </div>

            <!-- ✅ 到期日 -->
            <div class="mb-3">
                <label class="form-label">到期日</label>
                <input type="date" class="form-control" v-model="formData.expire" />
            </div>

            <!-- ✅ 圖片上傳 -->
            <div class="mb-3">
                <label class="form-label">圖片上傳</label>
                <input type="file" multiple class="form-control" @change="handleFileUpload" accept="image/*" />
                <div class="preview-container">
                    <div v-for="(image, index) in previewImages" :key="index" class="preview-image">
                        <img :src="image" class="img-thumbnail" />
                        <button type="button" class="btn btn-danger btn-sm remove-btn" @click="removeImage(index)">
                        <font-awesome-icon :icon="['far', 'circle-xmark']" style="color: #ffffff;" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
                <button type="submit" class="btn btn-primary">儲存</button>
            </div>
        </form>
        </div>
    </div>
    </div>
</div>
</template>

<script setup>
import { ref, watch } from "vue";
import * as bootstrap from "bootstrap";
import Swal from "sweetalert2";
import Multiselect from "vue-multiselect";
import useProductStore from "@/stores/productStore";
import useCategoryStore from "@/stores/categoryStore";
import useTagStore from "@/stores/productTagStore";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore();

const productModal = ref(null);
const previewImages = ref([]); // 存放圖片預覽

const formData = ref({
productId: "",
productImages: [],
productName: "",
categoryId: null,
tags: [],
originalPrice: 0,
salePrice: 0,
stockQuantity: 0,
unit: "",
description: "",
expire: "",
});

// ✅ 描述視窗允許 Shift+Enter 換行
const allowNewLine = (event) => {
    event.target.value += "\n";
};

// ✅ 手動開啟 Modal
const openModal = () => {
if (productModal.value) {
    const modalInstance = new bootstrap.Modal(productModal.value);
    modalInstance.show();
}
};

// ✅ 關閉 Modal
const closeModal = () => {
if (productModal.value) {
    const modalInstance = bootstrap.Modal.getInstance(productModal.value);
    if (modalInstance) modalInstance.hide();
}
};

// ✅ 處理圖片上傳
const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    // 檢查是否超過 5 張
    if (formData.value.productImages.length + files.length > 5) {
        Swal.fire("提示 :", "最多只能上傳 5 張圖片！", "error");
        return;
    }

    // 讀取圖片並預覽
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImages.value.push(e.target.result);
        };
        reader.readAsDataURL(file);
    });

    formData.value.productImages = [...formData.value.productImages, ...files]; // ✅ 保持文件列表
};

// 刪除預覽圖片
const removeImage = (index) => {
    previewImages.value.splice(index, 1);
    formData.value.productImages.splice(index, 1);
};

// ✅ 送出表單
const submitForm = async () => {
    // 1. 商品名稱不可空白
    if (!formData.value.productName.trim()) {
        Swal.fire("提示 :", "商品名稱不可空白！", "info");
        return;
    }

    // 2. 分類為必選
    if (!formData.value.categoryId) {
        Swal.fire("提示 :", "請選擇分類！", "info");
        return;
    }

    // 3. 原價不可空白
    if (!formData.value.originalPrice || formData.value.originalPrice <= 0) {
        Swal.fire("提示 :", "原價不可為空或小於 0！", "info");
        return;
    }

    // 4. 售價不可空白
    if (!formData.value.salePrice || formData.value.salePrice <= 0) {
        Swal.fire("提示 :", "售價不可為空或小於 0！", "info");
        return;
    }

    // 5. 庫存數量不可空白
    if (!formData.value.stockQuantity || formData.value.stockQuantity < 0) {
        Swal.fire("提示 :", "庫存數量不可為空或小於 0！", "info");
        return;
    }

    // 6. 單位根據分類預設，允許修改
    const selectedCategory = categoryStore.categories.find(cat => cat.categoryId === formData.value.categoryId);
    if (selectedCategory) {
        formData.value.unit = formData.value.unit || selectedCategory.defaultUnit;
    }

    // 7. 描述不可空白
    if (!formData.value.description.trim()) {
        Swal.fire("提示 :", "描述不可空白！", "info");
        return;
    }

    // 8. 到期日不可為空，且不可早於當下時間
    const today = new Date().toISOString().split("T")[0]; // 取得 YYYY-MM-DD 格式
    if (!formData.value.expire) {
        Swal.fire("提示 :", "請選擇到期日！", "info");
        return;
    } else if (formData.value.expire < today) {
        Swal.fire("提示 :", "到期日不可早於今天！", "info");
        return;
    }

    // 9. 圖片上傳最少 1 張，最多 5 張
    if (formData.value.productImages.length < 1 || formData.value.productImages.length > 5) {
        Swal.fire("提示 :", "請至少上傳 1 張圖片，最多 5 張！", "info");
        return;
    }

    // 通過驗證，執行 API 請求
    try {
        await productStore.addProduct(formData.value);
        Swal.fire("成功", "商品已成功新增！", "success");
        console.log("🚀 提交表單資料", formData.value);
        closeModal();
    } catch (error) {
        Swal.fire("錯誤", "新增商品失敗：" + error.message, "error");
    }
};

defineExpose({ openModal }); // 讓父組件 ProductManagement 可以調用 `openModal`

// ✅ 監聽分類變化，當分類變更時，自動填入 defaultUnit
watch(() => formData.value.categoryId, (newCategoryId) => {
    const selectedCategory = categoryStore.categories.find(cat => cat.categoryId === newCategoryId);
    if (selectedCategory) {
        formData.value.unit = selectedCategory.defaultUnit; // 自動帶入
    }
});
</script>

<style scoped>
.modal-content {
    border-radius: 12px;
    background-color: #f9f9f9;
}

/* 輸入提示樣式 */
.input-hint {
    font-size: 12px;
    color: red;
    margin-left: 10px;
    font-weight: normal;
}

/* ✅ 預覽圖片區域 */
.preview-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

/* ✅ 圖片預覽樣式 */
.preview-image {
    position: relative;
    width: 100px;
    height: 100px;
}

.preview-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
}

/* ✅ 刪除圖片按鈕 */
.remove-btn {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 24px;
    height: 24px;
    background-color: #feba07;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10; /* 確保在圖片上方 */
}
</style>
