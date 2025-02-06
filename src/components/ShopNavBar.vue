<template>
    <!-- ✅ 未登入時顯示 -->
    <template v-if="!isLoggedIn">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#"><RouterLink class="navbar-brand" aria-current="page" to="/">
            <img src="../assets/petLogo.png" alt="Logo圖示" width="80" title="首頁">壁爐之家</RouterLink></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item active">
            <a class="nav-link" href="#"><RouterLink class="nav-link active" aria-current="page" to="/shop">商城首頁</RouterLink></a>
            </li>
            <li class="nav-item">
            <a class="nav-link" href="#"><RouterLink class="nav-link" to="/secure/login">登入</RouterLink></a>
            </li>
        </ul>
            <form class="form-inline my-2 my-lg-0">
                <div class="search-bar">
                    <input class="search-input"
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="搜尋商品..." 
                    @input="emitSearch"
                    />
                    <select v-model="selectedCategory" class="category-select" @change="emitSearch">
                        <option value="">所有分類</option>
                        <option v-for="category in categoryStore.categories" :key="category.categoryId" :value="category.categoryId">
                        {{ category.categoryName }}
                        </option>
                    </select>
                    <button class="search-button" @click="applyFilters">
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
                    </button>
                </div>
                <p class="price-filter">
                        <label><font-awesome-icon icon="dollar-sign" style="color: #c6bc77;" /></label>
                        <span class="price-range">{{ minPrice }}</span>
                            <input type="range" v-model="minPrice" :min="priceRange.min" :max="priceRange.max" step="5" />
                        <!-- <input type="range" v-model="maxPrice" :min="priceRange.min" :max="priceRange.max" step="10" /> -->
                        <span class="price-range">{{ maxPrice }}</span>
                </p>
                </form>
            </div>
        </nav>
    </template>
    <!-- ✅ 已登入時顯示 -->
    <template v-else>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <RouterLink class="navbar-brand" aria-current="page" to="/">
                <img src="../assets/petLogo.png" alt="Logo圖示" width="80" title="首頁">壁爐之家</RouterLink>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item" title="商城首頁">
                            <RouterLink class="nav-link active" aria-current="page" to="/shop">商城首頁</RouterLink>
                        </li>
                        <li class="nav-item" title="願望清單">
                            <RouterLink class="nav-link active" aria-current="page" to="/shop/wishlist">願望清單</RouterLink>
                        </li>
                        <li class="nav-item" title="購物車">
                            <RouterLink class="nav-link active" aria-current="page" to="/shop/cart">購物車</RouterLink>
                        </li>
                        <li class="nav-item" title="訊息通知">
                            <RouterLink class="nav-link active" aria-current="page" to="/shop/notifications">訊息通知</RouterLink>
                        </li>
                        <li class="nav-item" title="訂單管理">
                            <RouterLink class="nav-link active" aria-current="page" to="/shop/orders">訂單管理</RouterLink>
                        </li>
                        <li class="nav-item" title="登出">
                            <button @click="logout">登出</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </template>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from "vue";
import { useCategoryStore } from "@/stores/categoryStore";
import { CategoryService } from "@/services/CategoryService";
import { ProductService } from "@/services/ProductService";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// 從 shopLayout provide()取得登入資訊
const isLoggedIn = inject("isLoggedIn"); // 登入狀態
const logout = inject("logout"); // 登出函數

const categoryStore = useCategoryStore();
const searchQuery = ref("");
const selectedCategory = ref("");
const minPrice = ref(0);
const maxPrice = ref(5000); // 假設最大價格
const priceRange = ref({ min: 0, max: 5000 }); // 設定價格範圍
const categories = ref([]);
const products = ref([]);
const emit = defineEmits(["search"]);

// searchBar取得預設分類商品
const fetchCategoriesAndProducts= async () => {
    try {
        await categoryStore.fetchCategories();
        
        console.log("成功獲取分類:", categoryStore.categories);
        
        if (!Array.isArray(categoryStore.categories)) {
            console.error("categoryStore.categories 不是陣列:", categoryStore.categories);
            return;
        }

        categoryStore.categories.forEach(category => {
            console.log(`分類: ${category.categoryName}`);
        });

    } catch (error) {
        console.error("fetchCategoriesAndProducts 發生錯誤:", error);
    }
};

// 計算價格分佈 (計算不同價格區間內的商品數量)
const priceDistribution = computed(() => {
const distribution = {};
products.value.forEach((product) => {
const price = Math.floor(product.salePrice / 100) * 100; // 以百元為一區間
if (!distribution[price]) {
    distribution[price] = 0;
}
distribution[price]++;
});
return distribution;
});

// 獲取分類
const fetchCategories = async () => {
try {
const response = await CategoryService.getAllCategories();
categories.value = response;
} catch (error) {
console.error("獲取分類失敗:", error);
}
};

// 獲取商品資料
const fetchProducts = async () => {
try {
const response = await ProductService.getAllProducts();
products.value = response;
} catch (error) {
console.error("獲取商品失敗:", error);
}
};

// 🔍 套用篩選條件
const applyFilters = () => {
console.log("搜尋條件:", {
searchQuery: searchQuery.value,
category: selectedCategory.value,
priceRange: [minPrice.value, maxPrice.value],
});

// 發送 API 搜尋請求
ProductService.searchProducts({
query: searchQuery.value,
category: selectedCategory.value,
minPrice: minPrice.value,
maxPrice: maxPrice.value,
});
};

// 掛載時獲取分類與商品資料
onMounted(() => {
fetchCategories();
fetchProducts();
});

// 當分類列表更新時，如果已選擇的分類不存在於新數據中，重設為 "所有分類"
watch(() => categoryStore.categories, (newCategories) => {
if (!newCategories.find(cat => cat.categoryId === selectedCategory.value)) {
selectedCategory.value = "";
}
});

</script>

<style scoped>
.navbar {
display: flex;
justify-content: space-between;
align-items: center;
background-color: #f8f9fa;
padding: 15px;
}

.nav-links a {
margin: 0 10px;
}

.search-bar {
display: flex;
align-items: center;
border: 1px solid #ddd;
border-radius: 30px;
padding: 5px 10px;
margin: 10px 10px 0 10px;
width: 100%;
max-width: 1000px;
background-color: white;
}

.search-input {
width: 600px;
flex: 1;
border: none;
outline: none;
padding: 8px;
margin-right: 10px;
}

.category-select {
margin-left: 8px;
border: 5px;
margin-right: 5px;
background: none;
cursor: pointer;
}

.price-filter{
    position: relative;
    float: inline-end;
}

.price-range{
border: 5px;
}

.search-button {
border: none;
background-color: transparent;
cursor: pointer;
font-size: 1.2rem;
}

button {
background: none;
border: none;
cursor: pointer;
color: #c6bc77;
}
</style>
