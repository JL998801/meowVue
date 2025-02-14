<template>
    <!-- 讓 container 佔滿剩餘空間 -->
    <div class="container-fluid content">

        <!-- 標題與新增按鈕 -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2>商品管理</h2>

            <!-- 商品模糊查詢 -->
            <div class="search-bar">
            <input v-model="searchQuery" type="text" class="form-control" placeholder="輸入商品關鍵字..." @keyup.enter="applyFilter" />
            </div>

            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#productFormModal">
            新增商品
            </button>
        </div>

        <!-- 商品列表 -->
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">編號</th>
                    <th scope="col">圖片</th>
                    <th scope="col">名稱</th>
                    <th scope="col">類別</th>
                    <th scope="col">標籤</th>
                    <th scope="col">到期日</th>
                    <th scope="col">原價</th>
                    <th scope="col">售價</th>
                    <th scope="col">庫存數量</th>
                    <th scope="col">單位</th>
                    <th scope="col">描述</th>
                    <th scope="col">狀態</th>
                    <th scope="col" ></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in productStore.products" :key="product.productId">
                    <td>{{ product.productId }}</td>
                    <td>
                    <div class="image-gallery">
                        <figure class="figure">
                        <!-- 主圖 -->
                        <img
                            :src="product.imageUrls.length > 0 ? product.imageUrls[0] : placeholderImage"
                            alt="主商品圖片"
                            class="figure-img img-fluid main-image"
                            @changeImg="(product.imageUrls[0])"
                        />

                        <!-- 其他圖片 (最多 4 張) -->
                        <div class="thumbnail-container">
                            <img
                            v-for="(image, index) in product.imageUrls.slice(1, 5)"
                            :key="index"
                            :src="image"
                            :alt="`商品圖片 ${index + 1}`"
                            class="figure-img img-fluid thumbnail"
                            />
                            <!-- 如果圖片不足 4 張，補上空白 -->
                            <div v-for="i in Math.max(0, 4 - (product.imageUrls.length - 1))" :key="'placeholder' + i" class="thumbnail placeholder"></div>
                        </div>
                        </figure>
                    </div>
                    </td>

                    <!-- 商品名稱 -->
                    <td v-if="!editMode[product.productId]">{{ product.productName }}</td>
                    <td v-else><input type="text" v-model="product.productName" class="form-control" /></td>

                    <!-- 類別 -->
                    <td v-if="!editMode[product.productId]">
                        {{ getCategoryName(product.categoryId) ? getCategoryName(product.categoryId) : "無分類" }}
                    </td>
                    <td v-else>
                        <select v-model="product.categoryId" class="form-select">
                        <option v-for="category in categoryStore.categories" :value="category.categoryId">
                            {{ category.categoryName }}
                        </option>
                        </select>
                    </td>

                    <!-- 標籤 -->
                    <td v-if="!editMode[product.productId]">
                        <span v-for="tag in product.tags || []" :key="tag.tagId" class="badge bg-primary">
                        {{ tag.tagName }}
                        </span>
                    </td>
                    <td v-else>
                        <select v-model="product.categoryId" class="form-select">
                        <option v-for="tag in tagStore.tags" :value="tag.tagId">
                            {{ tag.tagName }}
                        </option>
                        </select>
                    </td>

                    <!-- 到期日 -->
                    <td v-if="!editMode[product.productId]">{{ product.expire }}</td>
                    <td v-else><input type="date" v-model="product.expire" class="form-control" /></td>

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
                    <td v-if="!editMode[product.productId]">{{ product.description }}</td>
                    <td v-else><textarea v-model="product.description" class="form-control"></textarea></td>

                    <!-- 狀態 -->
                    <td v-if="!editMode[product.productId]">{{ product.status }}</td>
                    <td v-else>
                        <select v-model="product.status" class="form-select">
                        <option>上架</option>
                        <option>下架</option>
                        </select>
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

        <!-- 新增商品 Modal -->
        <div class="modal fade" id="productFormModal" tabindex="-1" aria-labelledby="productFormLabel" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="productFormLabel">新增商品</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <productForm />
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import productForm from "@/components/shop/manage/productForm.vue";
import useProductStore from "@/stores/productStore";
import useCategoryStore from "@/stores/categoryStore";
import useTagStore from "@/stores/productTagStore";
import Swal from "sweetalert2";

const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore();
const searchQuery = ref("");

const editMode = ref({}); // 追蹤每個 product 是否處於編輯狀態
const placeholderImage = "https://via.placeholder.com/100"; // 預設空白圖片

// **點擊搜尋按鈕時調用 `fetchFilteredProducts` 並發送事件**
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

// 根據 `categoryId` 找出對應的 `categoryName`
const getCategoryName = (categoryId) => {
    const category = categoryStore.categories.find(category => category.categoryId === categoryId);
    return category ? category.categoryName : "無分類";
};

// 新增商品: 導引到彈窗
const addProduct = () => {
    router.push("/admin/products/form")
};

// 刪除商品
const deleteProduct = (id) => {
    Swal.fire({
        title: "確定刪除此筆商品嗎?",
        text: "若還想保留商品交易資訊，請取消此操作；將商品狀態變更為 `下架`",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "確認刪除",
        cancelButtonText: "取消",
        reverseButtons: true,
        customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
        actions: "swal-buttons-container" // 🔹 這裡設置自定義 class
        },
        buttonsStyling: false
    }).then((result) => {
        if (result.isConfirmed) {
        // ✅ 確保 `productStore.deleteProduct(id)` 被正確執行
        productStore.deleteProduct(id).then(() => {
            Swal.fire({
            title: "刪除成功!",
            text: "商品已成功刪除。",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true
            });
        }).catch(() => {
            Swal.fire({
            title: "刪除失敗!",
            text: "發生錯誤，請稍後再試。",
            icon: "error"
            });
        });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        // ✅ 修正取消按鈕的提示內容
        Swal.fire({
            title: "取消刪除",
            text: "商品仍然保留。",
            icon: "info"
        });
        }
    });
};

// 點選單列"修改"按鈕
    // 切換編輯模式
    const modifyProduct = (productId) => {
    editMode.value[productId] = !editMode.value[productId];
    };

    // 儲存修改
    const saveProduct = (product) => {
    console.log("儲存修改", product);
    // 調用 API 更新商品資訊
    // productStore.updateProduct(product);
    editMode.value[product.productId] = false;
    };

    // 取消修改
    const cancelEdit = (productId) => {
    editMode.value[productId] = false;
    };

onMounted(() => {
    productStore.fetchProducts();
    categoryStore.fetchCategories();
    tagStore.fetchTags();
});

</script>

<style>
.table{
    border-radius: 999px; /* 讓邊框成為橢圓形 */
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

/* 讓 <td> 高度固定為 80px */
td {
    height: 80px;
    vertical-align: middle; /* 確保內容在 td 內垂直置中 */
    text-align: center;
}

.button{
    margin: 10px;
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

/* 主圖片樣式 */
.main-image {
    height: calc(100% - 4px); /* 確保圖片填滿 td，高度減去 margin */
    max-width: calc(100% - 60px); /* 確保不超出 figure，預留縮略圖空間 */
    object-fit: cover; /* 保持圖片比例，不變形 */
    border-radius: 8px;
    margin: 2px; /* 設定 2px 間距 */
}

/* 縮略圖容器：垂直排列，放置在主圖右側 */
.thumbnail-container {
    display: flex;
    flex-direction: column; /* 讓縮略圖垂直排列 */
    gap: 3px;
    justify-content: flex-start;
    width: 60px; /* 設定縮略圖區域 */
    height: 100%; /* 確保縮略圖區域與 `figure` 一致 */
    overflow: hidden; /* 避免超出 */
}

/* 縮略圖樣式 */
.thumbnail {
    width: 100%;
    height: auto;
    max-height: 15px; /* 限制縮略圖高度 */
    border-radius: 5px;
    object-fit: cover;
    cursor: pointer;
}


/* 空白區塊 (如果沒有足夠圖片) */
.placeholder {
    width: 100%;
    height: 15px;
    background-color: #f0f0f0;
    border-radius: 5px;
}

/* 限制按鈕的 `td` 最小寬度，確保不被壓縮 */
td:last-child {
    min-width: 150px; /* 確保按鈕列有足夠的空間 */
    text-align: center;
    white-space: nowrap; /* 避免按鈕換行 */
}

/* 讓 `input` / `select` 在編輯模式下不影響按鈕空間 */
td input,
td select,
td textarea {
  width: 100%; /* 讓輸入框填滿 `td` */
  min-width: 100px; /* 防止輸入框變得太小 */
}

/* 讓按鈕不會被壓縮 */
td .btn {
    padding: 5px 10px; /* 控制按鈕大小 */
    margin: 2px; /* 確保按鈕間有間距 */
    white-space: nowrap; /* 避免按鈕換行 */
    display: inline-block;
}

/* 調整按鈕區塊的彈性佈局，確保不擠壓 */
.action-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px; /* 確保按鈕之間有空間 */
}

</style>