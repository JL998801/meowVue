<template>
    <div class="modal fade" ref="productModal" id="productFormModal" tabindex="-1" aria-labelledby="productFormLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="productFormLabel">新增商品<span class="input-hint">*所有欄位皆為必填</span></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"/>
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
                    <select class="form-select" v-model="formData.categoryName">
                        <option v-for="category in categoryStore.categories" :key="category.categoryId" :value="category.categoryName" @change="updateCategory">
                        {{ category.categoryName }}
                        </option>
                    </select>
                </div>
    
                <!-- ✅ 單位 -->
                <div class="mb-3">
                    <label class="form-label">單位</label>
                    <input type="text" class="form-control" v-model="formData.unit" placeholder="請輸入單位" />
                </div>
    
                <!-- ✅ 標籤 -->
                <div class="mb-3">
                    <label class="form-label">標籤</label>
                    <div class="checkbox-group">
                    <div v-for="tag in tagStore.tags" :key="tag.tagId" class="form-check form-check-inline">
                        <input
                        class="form-check-input"
                        type="checkbox"
                        :id="'tag_' + tag.tagId"
                        :value="tag.tagId"
                        :checked="isSelected(tag)"
                        @change="toggleTag(tag)"
                        />
                        <label class="form-check-label" :for="'tag_' + tag.tagId">
                        {{ tag.tagName }}
                        </label>
                    </div>
                    </div>
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
    
                <!-- ✅ 描述: 換行使用 shift+enter；按下 Enter 會送出表單-->
                <div class="mb-3">
                    <label class="form-label">
                        描述 <span class="input-hint">*換行使用 Shift+Enter</span>
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
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
                    <button 
                        type="submit" 
                        class="btn btn-primary"  
                        @keydown.prevent="submitForm"
                    >儲存</button>
                </div>
            </form>
            </div>
        </div>
        </div>
    </div>
</template>
    
<script setup>
import { ref, watch } from "vue";
import Swal from "sweetalert2";
import useProductStore from "@/stores/productStore";
import useCategoryStore from "@/stores/categoryStore";
import useTagStore from "@/stores/productTagStore";

const previewImages = ref([]); // 存放圖片預覽

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore();

const formData = ref({
    productImages: [],
    productName: "",
    categoryName: "",
    tags: [],
    originalPrice: null,
    salePrice: null,
    stockQuantity: 0,
    unit: "",
    description: "",
    expire: "",
});

// ✅ 描述視窗允許 Shift+Enter 換行
const allowNewLine = (event) => {
    event.target.value += "\n";
};

// ✅ 切換分類
const updateCategory = () => {
    const selectedCategory = categoryStore.categories.find(
        cat => cat.categoryName === formData.value.categoryName
    );

    if (selectedCategory) {
        formData.value.categoryId = selectedCategory.categoryId; // ✅ 存 categoryId 供未來使用
        formData.value.unit = selectedCategory.unit || ""; // ✅ 自動填充單位
    }

    console.log("✅ 選擇的分類:", formData.value.categoryName, " (ID:", formData.value.categoryId, ") 單位:", formData.value.unit);
};

// ✅ 檢查標籤是否已選取
const isSelected = (tag) => {
    return formData.value.tags.some((selectedTag) => selectedTag.tagId === tag.tagId);
};

// ✅ 切換標籤選擇狀態
const toggleTag = (tag) => {
    const index = formData.value.tags.findIndex((selectedTag) => selectedTag.tagId === tag.tagId);
    if (index === -1) {
        formData.value.tags.push(tag); // ✅ 新增標籤
    } else {
        formData.value.tags.splice(index, 1); // ✅ 取消選取標籤
    }
};

// ✅ 處理圖片上傳
const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    files.forEach(file => {
        // ✅ 確保是 `File` 類型
        if (!(file instanceof File)) {
            console.warn("⚠️ 非 File 類型，將忽略:", file);
            return;
        }

        // ✅ 限制最多 5 張
        if (formData.value.productImages.length >= 5) {
            Swal.fire("提示 :", "最多只能上傳 5 張圖片！", "error");
            return;
        }

        // ✅ 檢查是否已存在相同檔案（避免重複）
        if (formData.value.productImages.some(existingFile => existingFile.name === file.name)) {
            Swal.fire("提示 :", "圖片已存在，請選擇其他圖片！", "info");
            return;
        }

        // ✅ 讀取圖片並預覽
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImages.value.push(e.target.result); // ✅ 存入 Base64 預覽圖
        };
        reader.readAsDataURL(file);

        // ✅ 存入 `File`（確保傳到後端）
        formData.value.productImages.push(file);
    });

    // ✅ 確保數據正確
    console.log("📷 已選擇的圖片:", formData.value.productImages);
};


// 刪除預覽圖片
const removeImage = (index) => {
    previewImages.value.splice(index, 1);
    formData.value.productImages.splice(index, 1);
};

// ✅ 送出表單: 後端將圖片和其他欄位分成兩組 @RequestPart，在前端回傳構建 FormData 也要分開處理
const submitForm = async () => {
    try {
        // ✅ **驗證必填欄位**
        if (!formData.value.productName.trim()) return Swal.fire("提示 :", "商品名稱不可空白！", "info");
        if (!formData.value.categoryName) return Swal.fire("提示 :", "請選擇分類！", "info");
        if (!formData.value.originalPrice || formData.value.originalPrice <= 0) return Swal.fire("提示 :", "原價不可為空或小於 0！", "info");
        if (!formData.value.salePrice || formData.value.salePrice <= 0) return Swal.fire("提示 :", "售價不可為空或小於 0！", "info");
        if (!formData.value.stockQuantity || formData.value.stockQuantity < 0) return Swal.fire("提示 :", "庫存數量不可為空或小於 0！", "info");
        if (!formData.value.description.trim()) return Swal.fire("提示 :", "描述不可空白！", "info");

        // ✅ **轉換 originalPrice 和 salePrice 為 BigDecimal 格式 (字串格式的數字)**: 配合後端設定
        console.log("originalPrice 類型:", typeof formData.value.originalPrice);
        console.log("salePrice 類型:", typeof formData.value.salePrice);
        formData.value.originalPrice = formData.value.originalPrice ? parseFloat(formData.value.originalPrice.toFixed(2)) : null;
        formData.value.salePrice = formData.value.salePrice ? parseFloat(formData.value.salePrice.toFixed(2)) : null;
        // formData.value.originalPrice = formData.value.originalPrice ? parseFloat(formData.value.originalPrice.toFixed(2)) : 0;
        // formData.value.salePrice = formData.value.salePrice ? parseFloat(formData.value.salePrice.toFixed(2)) : 0;
        // formData.value.originalPrice = formData.value.originalPrice ? Number(parseFloat(formData.value.originalPrice).toFixed(2)) : 0;
        // formData.value.salePrice = formData.value.salePrice ? Number(parseFloat(formData.value.salePrice).toFixed(2)) : 0;

        // ✅ **驗證日期格式**
        const today = new Date().toISOString().split("T")[0];
        if (!formData.value.expire || formData.value.expire < today) return Swal.fire("提示 :", "請選擇有效的到期日！", "info");

        // ✅ **圖片上傳至少 1 張，最多 5 張**
        if (formData.value.productImages.length < 1 || formData.value.productImages.length > 5) {
            return Swal.fire("提示 :", "請至少上傳 1 張圖片，最多 5 張！", "info");
        }

        // ✅ **構建符合後端需求的 `newProductData`**
        const newProductData = {
            productName: formData.value.productName,
            description: formData.value.description,
            originalPrice: formData.value.originalPrice,
            salePrice: formData.value.salePrice,
            stockQuantity: formData.value.stockQuantity,
            expire: formData.value.expire,
            categoryName: formData.value.categoryName,
            unit: formData.value.unit,
            tags: formData.value.tags.map(tag => ({ tagName: tag.tagName })),
        };

        console.log("✅ 提交的 JSON 數據:", JSON.stringify(newProductData, null, 2));

        // ✅ 建立 `FormData`: 透過 stringify 轉成 string
        // 但 JSON.stringify() 會將 所有數據轉換為字串，可能導致後端解析 originalPrice 變成 null
        // spring boot 版本差異導致傳輸格式要求嚴格???
        const formDataToSend = new FormData();
        // formDataToSend.append("productRequest", JSON.stringify(newProductData));  // Spring Boot 3.4.1 適用
        formDataToSend.append("productRequest", new Blob([JSON.stringify(newProductData)], { type: "application/json" })); // 其他Spring Boot版本適用

        // ✅ 附加圖片
        formData.value.productImages.forEach((file, index) => {
            if (file instanceof File) {
                formDataToSend.append("productImages", file);
            } else {
                console.warn(`⚠️ 第 ${index + 1} 張圖片不是 File 類型，忽略:`, file);
            }
        });

        for (let pair of formDataToSend.entries()) {
            console.log("📦 FormData 項目:", pair[0], pair[1]);
        }

        // ✅ **發送 API 請求**
        await productStore.addProduct(formDataToSend);
        Swal.fire("成功", "商品已成功新增！", "success");

    } catch (error) {
        console.error("🔴 新增商品失敗:", error.response?.data || error.message);
        Swal.fire("錯誤", "新增商品失敗：" + (error.response?.data || error.message), "error");
    }
};

// 監聽分類變化，當分類變更時，自動填入 defaultUnit
watch(() => formData.value.categoryName, (newCategoryName) => {
    const selectedCategory = categoryStore.categories.find(
        cat => cat.categoryName === newCategoryName
    );

    if (selectedCategory) {
        formData.value.categoryId = selectedCategory.categoryId; // ✅ 儲存 `categoryId`
        formData.value.unit = selectedCategory.unit || ""; // ✅ 自動填充 `unit`
    }
});
</script>
    
<style scoped>
.modal-title{
    font-weight: 800;
}

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
    background-color: #c6bc77;
    border: none;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10; /* 確保在圖片上方 */
}

/* ✅ 讓 `checkbox` 間距更明顯 */
.checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
</style>
