<template>
  <h2>遺失通報表單</h2>
  <div class="container">
    <form @submit.prevent="submitForm">
      <!-- 案件標題 -->
      <div class="form-group">
        <label for="caseTitle">*案件標題：</label>
        <input v-model="form.caseTitle" id="caseTitle" type="text" required />
      </div>

      <!-- 寵物種類 -->
      <div class="form-group">
        <label for="species">*寵物種類：</label>
        <select v-model="form.speciesId">
          <option value="">請選擇</option>
          <option
            v-for="species in speciesList"
            :key="species.speciesId"
            :value="species.speciesId"
          >
            {{ species.species }}
          </option>
        </select>
      </div>

      <!-- 品種 -->
      <div class="form-group">
        <label for="breed">品種：</label>
        <select v-model="form.breedId">
          <option value="">請選擇</option>
          <option
            v-for="breed in breedList"
            :key="breed.breedId"
            :value="breed.breedId"
          >
            {{ breed.breed }}
          </option>
        </select>
      </div>

      <!-- 毛色 -->
      <div class="form-group">
        <label for="furColor">毛色：</label>
        <select v-model="form.furColorId">
          <option value="">請選擇</option>
          <option
            v-for="fur in furColorList"
            :key="fur.furColorId"
            :value="fur.furColorId"
          >
            {{ fur.furColor }}
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
        <label for="microChipNumber">晶片號碼：</label>
        <input
          type="text"
          id="microChipNumber"
          v-model="form.microChipNumber"
          @input="validateMicroChipNumber"
          placeholder="請輸入10位數字"
        />
        <p
          v-if="microChipNumber.length !== 10 && microChipNumber.length > 0"
          style="color: red"
        >
          晶片號碼必須為 10 位數字
        </p>
      </div>

      <!-- 縣市與鄉鎮區 -->
      <div class="form-group">
        <label for="city">城市：</label>
        <select v-model="form.cityId" @change="fetchDistrictAreas">
          <option value="">請選擇</option>
          <option
            v-for="city in cityList"
            :key="city.cityId"
            :value="city.cityId"
          >
            {{ city.city }}
          </option>
        </select>

        <!-- 區域選擇 -->
        <label for="district">區域：</label>
        <select v-model="form.districtAreaId">
          <option value="">請選擇</option>
          <option
            v-for="district in districtAreaList"
            :key="district.districtAreaId"
            :value="district.districtAreaId"
          >
            {{ district.districtAreaName }}
          </option>
        </select>
      </div>

      <!-- 走失地點 -->
      <div class="form-group">
        <label>詳細地址：</label>
        <input v-model="form.street" type="text" />
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
        <div class="upload-image">
          <ImageUpload @image-uploaded="ImageUploaded"></ImageUpload>
          <ImageUpload @image-uploaded="ImageUploaded"></ImageUpload>
          <ImageUpload @image-uploaded="ImageUploaded"></ImageUpload>
        </div>
      </div>

      <!-- 提交按鈕 -->
      <button type="submit" class="submit-btn">提交案件</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axiosapi from "@/plugins/axios.js";
import { useRouter } from "vue-router";
import ImageUpload from "./ImageUpload.vue";

const router = useRouter();


// **表單數據**
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
  districtAreaId: "",
  street: "",
  lostExperience: "",
  featureDescription: "",
  contactInformation: "",
  caseStateId: 5, // 固定為 "待協尋"
  memberId: "", // 會員 ID
  images: [],
});

// **存放後端數據**
const speciesList = ref([]);
const breedList = ref([]);
const furColorList = ref([]);
const cityList = ref([]);
const districtAreaList = ref([]);
const caseStateList = ref([]);

// **獲取後端資料**
const fetchData = async () => {
  try {
    const [speciesRes, breedRes, colorRes, cityRes, caseStateRes] =
      await Promise.all([
        axiosapi.get(`/pet/allSpecies`),
        axiosapi.get(`/pet/allBreed`),
        axiosapi.get(`/pet/allFurColor`),
        axiosapi.get(`/pet/allCity`),
        axiosapi.get(`/pet/allCaseState`),
      ]);

    speciesList.value = speciesRes.data;
    breedList.value = breedRes.data;
    furColorList.value = colorRes.data;
    cityList.value = cityRes.data;
    caseStateList.value = caseStateRes.data;

    console.log("✅ 物種:", speciesList.value);
    console.log("✅ 品種:", breedList.value);
    console.log("✅ 毛色:", furColorList.value);
    console.log("✅ 城市:", cityList.value);
    console.log("✅ 案件狀態:", caseStateList.value);
  } catch (error) {
    console.error("❌ 獲取資料失敗:", error);
  }
};

const fetchCaseState = async () => {
    try {
        const response = await axiosapi.get("/pet/allCaseState");
        caseStateList.value = response.data;

        // 預設 `caseStateId` 為 5
        let defaultCaseState = caseStateList.value.find(state => state.caseStateId === 5);
        
        if (defaultCaseState) {
            form.value.caseStateId = defaultCaseState.caseStateId; // 設定 5
        } else if (caseStateList.value.length > 0) {
            form.value.caseStateId = caseStateList.value[0].caseStateId; // 沒有 5 就用第一個
        }

        console.log("✅ 獲取案件狀態成功：", caseStateList.value);
        console.log("🔍 預設案件狀態 ID：", form.value.caseStateId);
    } catch (error) {
        console.error("❌ 無法獲取案件狀態：", error);
    }
};

// **根據城市獲取區域**
const fetchDistrictAreas = async () => {
  if (!form.value.cityId) return; // 確保 `cityId` 有選擇

  try {
    const response = await axiosapi.get(
      `/pet/districtAreasByCity/${form.value.cityId}`
    );
    districtAreaList.value = response.data;
    console.log("✅ 獲取區域成功:", districtAreaList.value);
  } catch (error) {
    console.error("❌ 無法獲取區域:", error);
  }
};

// **監聽 `cityId` 變化，自動獲取區域**
watch(
  () => form.value.cityId,
  (newCityId) => {
    if (newCityId) {
      fetchDistrictAreas();
    } else {
      districtAreaList.value = []; // 清空區域列表
    }
  }
);

// 定義 microChipNumber
const microChipNumber = ref("");

// 限制輸入只能是 10 位數字
const validateMicroChipNumber = () => {
  form.value.microChipNumber = form.value.microChipNumber.replace(/\D/g, "").slice(0, 10);
};

// **圖片預覽**
const previewImages = ref([]);

// // **處理圖片上傳**
// const handleFileUpload = (event) => {
//     const files = Array.from(event.target.files);
//     if (files.length > 3) {
//         alert("最多只能上傳 3 張圖片！");
//         return;
//     }

//     form.value.images = files; // 儲存圖片數據
//     previewImages.value = files.map((file) => URL.createObjectURL(file));
// };

// 監聽圖片上傳事件
const ImageUploaded = (backTmpUrl) => {
  form.value.images.push(backTmpUrl);
};

// **提交表單**
const submitForm = async () => {
  console.log("🔍 準備提交資料：", JSON.stringify(form.value, null, 2));

  if (!form.value.caseTitle || !form.value.speciesId || !form.value.cityId || !form.value.districtAreaId) {
    alert("請確保所有必填項目都有填寫！");
    return;
  }

  // 從 localStorage 取得 token
  const storedUser = localStorage.getItem("user");
  let token = localStorage.getItem("token");

  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      if (userData.token) {
        token = userData.token; // 優先使用 `user` 內的 token
      }
    } catch (error) {
      console.error("❌ 解析 user 失敗", error);
    }
  }

  if (!token) {
    alert("登入憑證失效，請重新登入！");
    router.push("/secure/login");
    return;
  }

  try {
    const response = await axiosapi.post(`/lostcases/create`, form.value, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    alert("案件已成功提交！");
    console.log("✅ 伺服器回應：", response.data);
    router.push("/pet/lost"); // 提交成功後跳轉
  } catch (error) {
    console.error("❌ 提交表單失敗：", error.response ? error.response.data : error.message);
    alert("提交失敗，請檢查資料是否完整！");
  }
};

// **頁面載入時執行**
onMounted(() => {
  checkLogin();
  fetchData();
  fetchCaseState();
});
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

input,
select,
textarea {
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
