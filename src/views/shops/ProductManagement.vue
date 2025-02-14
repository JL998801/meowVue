<template>
    <!-- Hoverable rows -->
    <h1>商品管理  
        <button class="" @click="addProduct">
            <productForm />  <!--新增商品按鈕，跳出彈窗 productForm-->
        </button>
    </h1>
    <table class="table table-hover">
        <thead>
            <tr>
                <th scope="col">商品編號</th>
                <th scope="col">商品圖片</th>
                <th scope="col">名稱</th>
                <th scope="col">類別</th>
                <th scope="col">標籤</th>
                <th scope="col">到期日</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">庫存數量</th>
                <th scope="col">單位</th>
                <th scope="col">商品描述</th>
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
                <td>{{ product.productName }}</td>
                <td>{{ getCategoryName(product.categoryId) }}</td>
                <td>
                <span v-for="tag in product.tags || []" :key="tag.tagId" class="badge bg-primary">
                    {{ tag.tagName }}
                </span>
                </td>
                <td>{{ product.expire }}</td>
                <td>{{ product.originalPrice }}</td>
                <td>{{ product.salePrice }}</td>
                <td>{{ product.stockQuantity }}</td>
                <td>{{ product.unit }}</td>
                <td>{{ product.description }}</td>
                <td>{{ product.status }}</td>
                <td>
                <button type="button" class="btn btn-primary btn-lg" style="margin-right: 10px;"@click="deleteProduct(product.productId)">刪除</button>
                <button type="button" class="btn btn-primary btn-lg" @click="modifyProduct(product.productId)">修改</button>
                </td>
            </tr>
            </tbody>
    </table>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
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

// ✅ 方法：根據 `categoryId` 找出對應的 `categoryName`
const getCategoryName = (categoryId) => {
  const category = categoryStore.categories.find(category => category.categoryId === categoryId);
  return category ? category.categoryName : "無分類";
};

// 預設空白圖片
const placeholderImage = "https://via.placeholder.com/600x400";

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

// 修改商品 (傳入 id 及更新數據)
const modifyProduct = (id, updatedData) => {
  productStore.modifyProduct(id, updatedData);
};

// 新增商品: 導引到彈窗
const addProduct = () => {
    router.push("/productForm")
};

// 修改圖片
const changeImg=()=>{
    
}

onMounted(() => {
    productStore.fetchProducts();
    categoryStore.fetchCategories();
    tagStore.fetchTags();
});

</script>

<style>
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

</style>