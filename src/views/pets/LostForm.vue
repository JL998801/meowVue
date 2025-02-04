<template>
    <div class="container">
        <h2>遺失通報表單</h2>
        <form @submit.prevent="submitForm">
            <!-- 案件標題 -->
            <div class="form-group">
                <label for="caseTitle">*案件標題：</label>
                <input v-model="form.caseTitle" id="caseTitle" type="text" required />
            </div>
        
            <!-- 寵物種類 -->
            <div class="form-group">
                <label>*寵物種類：</label>
                <select v-model="form.speciesId" required>
                    <option v-for="species in speciesList" :key="species.id" :value="species.id">
                        {{ species.name }}
                    </option>
                </select>
            </div>
        
            <!-- 品種 -->
            <div class="form-group">
                <label>品種：</label>
                <select v-model="form.breedId">
                    <option v-for="breed in breedList" :key="breed.id" :value="breed.id">
                        {{ breed.name }}
                    </option>
                </select>
            </div>
        
            <!-- 毛色 -->
            <div class="form-group">
                <label>毛色：</label>
                <select v-model="form.furColorId">
                    <option v-for="color in furColorList" :key="color.id" :value="color.id">
                        {{ color.name }}
                    </option>
                </select>
            </div>
        
            <!-- 寵物姓名 -->
            <div class="form-group">
                <label>寵物姓名：</label>
                <input v-model="form.name" type="text" />
            </div>
        
            <!-- 寵物性別 -->
            <div class="form-group">
                <label>寵物性別：</label>
                <select v-model="form.gender">
                    <option value="男">男</option>
                    <option value="女">女</option>
                </select>
            </div>

            <!-- 絕育狀態 -->
            <div class="form-group">
                <label>*絕育狀態：</label>
                <select v-model="form.sterilization" required>
                    <option value="已絕育">已絕育</option>
                    <option value="未絕育">未絕育</option>
                </select>
            </div>

            <!-- 年齡 -->
            <div class="form-group">
                <label>年齡：</label>
                <input v-model="form.age" type="number" />
            </div>

            <!-- 晶片號碼 -->
            <div class="form-group">
                <label>晶片號碼：</label>
                <input v-model="form.microChipNumber" type="text" />
            </div>

            <!-- 縣市與鄉鎮區 -->
            <div class="form-group">
                <label>*縣市：</label>
                <select v-model="form.cityId" required>
                    <option v-for="city in cityList" :key="city.id" :value="city.id">
                        {{ city.name }}
                    </option>
                </select>
                <label>*鄉鎮區：</label>
                <select v-model="form.distinctAreaId" required>
                    <option v-for="area in distinctAreaList" :key="area.id" :value="area.id">
                        {{ area.name }}
                    </option>
                </select>
            </div>

            <!-- 走失地點 -->
            <div class="form-group">
                <label>*詳細地址：</label>
                <input v-model="form.street" type="text" required />
            </div>

            <!-- 走失經過 -->
            <div class="form-group">
                <label>*走失經過：</label>
                <textarea v-model="form.lostExperience" required></textarea>
            </div>

            <!-- 特徵描述 -->
            <div class="form-group">
                <label>*特徵描述：</label>
                <textarea v-model="form.featureDescription" required></textarea>
            </div>

            <!-- 聯絡方式 -->
            <div class="form-group">
                <label>聯絡方式：</label>
                <input v-model="form.contactInformation" type="text" />
            </div>

            <!-- 圖片上傳（最多 3 張） -->
            <div class="form-group">
                <label>案件圖片（第一張為封面，最多 3 張）：</label>
                <input type="file" @change="handleFileUpload" multiple accept="image/*" />
                <div class="image-preview">
                    <div v-for="(image, index) in previewImages" :key="index" class="image-container">
                        <img :src="image" alt="案件圖片" />
                        <span v-if="index === 0" class="cover-label">封面</span>
                    </div>
                </div>
            </div>

            <!-- 提交按鈕 -->
            <button type="submit" class="submit-btn">提交案件</button>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const form = ref({
    caseTitle: "",
    speciesId: "",
    breedId: "",
    furColorId: "",
    name: "",
    gender: "",
    sterilization: "",
    age: null,
    microChipNumber: null,
    cityId: "",
    distinctAreaId: "",
    street: "",
    lostExperience: "",
    featureDescription: "",
    contactInformation: "",
    images: []
});

const speciesList = ref([]);
const breedList = ref([]);
const furColorList = ref([]);
const cityList = ref([]);
const distinctAreaList = ref([]);
const lostCases = ref([]);

// 獲取後端資料
const fetchData = async () => {
    try {
        const [speciesRes, breedRes, colorRes, cityRes, areaRes, lostCasesRes] = await Promise.all([
            axios.get("http://localhost:8080/pet/allSpecies"),
            axios.get("http://localhost:8080/pet/allBreed"),
            axios.get("http://localhost:8080/pet/allFurColor"),
            axios.get("http://localhost:8080/pet/allCity"),
            axios.get("http://localhost:8080/pet//districtAreasByCity/{cityId}"),
            axios.get("http://localhost:8080/pet//allCaseState"),
            axios.get("http://localhost:8080/lostcases")
        ]);
        
        speciesList.value = speciesRes.data;
        breedList.value = breedRes.data;
        furColorList.value = colorRes.data;
        cityList.value = cityRes.data;
        distinctAreaList.value = areaRes.data;
        lostCases.value = lostCasesRes.data;
    } catch (error) {
        console.error("獲取資料失敗:", error);
    }
};

// 圖片預覽
const previewImages = ref([]);

// 處理圖片上傳
const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 3) {
        alert("最多只能上傳 3 張圖片！");
        return;
    }

    form.value.images = files; // 儲存圖片數據
    previewImages.value = files.map((file) => URL.createObjectURL(file));
};

// 提交表單
const submitForm = async () => {
    const formData = new FormData();
    
    // 將表單數據加入 formData
    Object.keys(form.value).forEach((key) => {
        if (key === "images") {
            form.value.images.forEach((image) => formData.append("images", image));
        } else {
            formData.append(key, form.value[key]);
        }
    });

    try {
        const response = await axios.post("http://localhost:8080/lostcase/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        alert("案件已成功提交！");
        console.log("回應資料：", response.data);
    } catch (error) {
        console.error("提交表單失敗：", error);
        alert("提交失敗，請重試");
    }
};

onMounted(fetchData);

</script>
<style scoped>
.container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 15px;
}

label {
    font-weight: bold;
    display: block;
}

input, select, textarea {
    width: 100%;
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.image-preview {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.image-container {
    position: relative;
    width: 100px;
    height: 100px;
}

.image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.cover-label {
    position: absolute;
    bottom: 5px;
    left: 5px;
    background: #ff5722;
    color: white;
    font-size: 12px;
    padding: 2px 5px;
    border-radius: 3px;
}
</style>