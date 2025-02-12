<template>
    <!-- 🔹 Bootstrap Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">填寫表單</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>

        <div class="modal-body">
            <!-- 🔹 表單 -->
            <form @submit.prevent="submitForm">
            <!-- 商品名稱 -->
            <div class="form-group">
                <label for="productName">商品名稱</label>
                <input type="text" class="form-control" id="productName" placeholder="商品名稱" v-model="productName">
            </div>

            <!-- 商品描述 -->
            <div class="form-group">
                <label for="description">商品描述</label>
                <textarea class="form-control" id="description" rows="3" v-model="description"></textarea>
            </div>

            <!-- 類別單選 -->
            <div class="form-group">
            <label for="category">類別選單</label>
            <select class="form-control" id="category" v-model="selectedCategory">
                <option disabled value="">請選擇類別</option>
                <option v-for="category in categories" :key="category.categoryId" :value="category.id">
                    {{ category.categoryName }}
                </option>
                </select>
            </div>

            <!-- 標籤多選 -->
            <div class="form-group">
                <div class="form-check form-check-inline" v-for="tag in tags" :key="tag.tagId">
                <input class="form-check-input" type="checkbox" :tagId="`tag-${tag.tagId}`" :value="tag.tagId" v-model="selectedTags">
                <label class="form-check-label" :for="`tag-${tag.tagId}`">{{ tag.tagName }}</label>
                </div>
            </div>

            <!-- 到期日 -->
            <div class="form-group">
                <label for="datepicker">選擇日期：</label>
                <flat-pickr v-model="selectedDate" class="form-control" :config="config"></flat-pickr>
            </div>

            <!-- 原價 -->
            <div class="form-group">
            <label>原價</label>
            <div class="input-group mb-3">
                <span class="input-group-text">$</span>
                <input type="number" class="form-control" v-model="originalPrice">
                <span class="input-group-text">元</span>
            </div>
            </div>

            <!-- 售價 -->
            <div class="form-group">
                <label>售價</label>
                <div class="input-group mb-3">
                    <span class="input-group-text">$</span>
                    <input type="number" class="form-control" v-model="salePrice">
                    <span class="input-group-text">元</span>
                </div>
            </div>

            <!-- 庫存數量 -->
            <div class="form-group">
                <label for="stockQuantity">庫存數量</label>
                <input type="number" class="form-control" id="stockQuantity" placeholder="輸入庫存數量" v-model="stockQuantity">
            </div>

            <!-- 檔案上傳 -->
            <div class="form-group">
                <label for="inputGroupFile04" class="form-label">上傳圖片</label>
                <input type="file" class="form-control" id="inputGroupFile04" multiple @change="handleFileUpload">
            </div>

            <!-- 按鈕 -->
            <div class="form-group mt-3">
                <button type="submit" class="btn btn-primary">提交</button>
                <button type="button" class="btn btn-secondary ms-2" @click="clearForm">清空</button>
            </div>
            </form>
        </div>
        </div>
    </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import FlatPickr from "vue-flatpickr-component";  //圖片上傳
import "flatpickr/dist/flatpickr.css";
import useCategoryStore from "@/stores/categoryStore";
import useTagStore from "@/stores/productTagStore";

const categoryStore = useCategoryStore();
const tagStore = useTagStore();

const productName = ref("");
const description = ref("");
const selectedCategory = ref(null);
const selectedTags = ref([]);
const selectedDate = ref("");
const originalPrice = ref("");
const salePrice = ref("");
const stockQuantity = ref("");
const categories = ref(categoryStore.categories);
const tags = ref(tagStore.tags);

const config = ref({ dateFormat: "Y-m-d" });

// 載入類別和標籤
onMounted(() => {
    categoryStore.fetchCategories();
    tagStore.fetchTags();
});

const submitForm = () => {
    console.log("提交表單:", { productName, description, selectedCategory, selectedTags, selectedDate });
};

const clearForm = () => {
    productName.value = "";
    description.value = "";
    selectedCategory.value = null;
    selectedTags.value = [];
    selectedDate.value = "";
};
</script>
