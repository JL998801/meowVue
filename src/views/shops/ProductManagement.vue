<template>
    <!-- Hoverable rows -->
    <h1>商品管理</h1>
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
            </tr>
        </thead>
        <tbody>
            <!-- 🔹 迭代 `productStore.products` 顯示每個商品 -->
            <tr v-for="product in productStore.products" :key="product.productId">
                <td>
                    <figure class="figure">
                        <img  
                            v-for="(image, index) in product.imageUrls" 
                            :key="index" 
                            :src="image" 
                            :alt="`商品圖片 ${index + 1}`" 
                            class="figure-img img-fluid rounded" alt="...">
                        <figcaption class="figure-caption text-right"></figcaption>
                    </figure>
                </td>
                <td>{{ product.productName }}</td>
                <td>
                    {{
                    categories.find(category => category.products.some(p => p.productId === product.productId))?.categoryName || "無類別"
                    }}
                </td>
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
            </tr>
        </tbody>
    </table>
    <productForm />  <!--新增商品按鈕，跳出彈窗 productForm-->
        
</template>

<script setup>
import { ref, onMounted } from "vue";
import productForm from "@/components/shop/manage/productForm.vue";
import useProductStore from "@/stores/productStore";
import useCategoryStore from "@/stores/categoryStore";
import useTagStore from "@/stores/productTagStore";

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const tagStore = useTagStore();

onMounted(() => {
    productStore.fetchProducts();
    categoryStore.fetchCategories();
    tagStore.fetchTags();
});

</script>