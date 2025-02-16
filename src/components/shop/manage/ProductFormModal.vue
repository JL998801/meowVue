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
            <input type="text" class="form-control" v-model="formData.unit" />
            </div>

            <!-- ✅ 描述 -->
            <div class="mb-3">
            <label class="form-label">描述</label>
            <textarea class="form-control" v-model="formData.description"></textarea>
            </div>

            <!-- ✅ 到期日 -->
            <div class="mb-3">
            <label class="form-label">到期日</label>
            <input type="date" class="form-control" v-model="formData.expire" />
            </div>

            <!-- ✅ 圖片上傳 -->
            <div class="mb-3">
            <label class="form-label">圖片</label>
            <input type="file" multiple class="form-control" @change="handleFileUpload" />
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
import { ref } from "vue";
import * as bootstrap from "bootstrap";
import Multiselect from "vue-multiselect";
import useCategoryStore from "@/stores/categoryStore";
import useTagStore from "@/stores/productTagStore";

const categoryStore = useCategoryStore();
const tagStore = useTagStore();
const productModal = ref(null);
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
formData.value.productImages = Array.from(event.target.files);
};

// ✅ 送出表單
const submitForm = () => {
console.log("🚀 提交表單資料", formData.value);
closeModal();
};

defineExpose({ openModal }); // 讓父組件可以調用 `openModal`
</script>

<style scoped>
.modal-content {
border-radius: 12px;
}
</style>
