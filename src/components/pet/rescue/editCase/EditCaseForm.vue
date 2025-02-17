<template>
  <h2 class="form-title">救援通報表單</h2>
  <div class="form-container">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label class="required">救援狀態</label>
        <select class="form-caseState" v-model="form.caseStateId" required>
          <option value="3">待救援</option>
          <option value="4">已救援</option>
          <option value="7">變成小天使</option>
          <option value="8">案件失敗</option>
        </select>
      </div>

      <div class="form-group">
        <label for="caseTitle" class="required">救援標題</label>
        <input
          type="text"
          id="caseTitle"
          v-model="form.caseTitle"
          placeholder="[範例] 廟旁發現受傷流浪貓需協助！"
          required
        />
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="species" class="required">動物類別</label>
          <select id="species" v-model="form.speciesId" required>
            <option value=""></option>
            <option
              v-for="species in speciesList"
              :key="species.speciesId"
              :value="species.speciesId"
            >
              {{ species.species }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="breed" class="required">物種</label>
          <select id="breed" v-model="form.breedId" required>
            <option value=""></option>
            <option
              v-for="breed in breeds"
              :key="breed.breedId"
              :value="breed.breedId"
            >
              {{ breed.breed }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="furColor">毛色</label>
          <select v-model="form.furColorId">
            <option value=""></option>
            <option
              v-for="color in furColors"
              :key="color.furColorId"
              :value="color.furColorId"
            >
              {{ color.furColor }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="city" class="required">縣市</label>
          <select id="city" v-model="form.cityId" required>
            <option
              v-for="city in cities"
              :key="city.cityId"
              :value="city.cityId"
            >
              {{ city.city }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="district" class="required">鄉鎮區</label>
          <select id="district" v-model="form.districtAreaId" required>
            <option
              v-for="dist in districts"
              :key="dist.districtAreaId"
              :value="dist.districtAreaId"
            >
              {{ dist.districtAreaName }}
            </option>
          </select>
        </div>
      </div>

      <div class="form-group form-single-row">
        <label for="address">街道地址</label>
        <input
          type="text"
          id="address"
          v-model="form.street"
          placeholder="例如: XX路 XX號"
        />
      </div>

      <div class="form-group form-single-row">
        <label for="mark" class="required">走失標記</label>
        <select id="mark" v-model="form.suspLost" required>
          <option value="true">是</option>
          <option value="false">否</option>
        </select>
        <span class="optional"
          >此欄位代表是否為疑似走失，如果是，我們會增加特殊標示。</span
        >
      </div>

      <div class="form-group form-single-row">
        <label class="required">救援需求(多選)</label>
        <div class="checkbox-group">
          <label
            v-for="rescueDemand in rescueDemands"
            :key="rescueDemand.rescueDemandId"
          >
            <input
              type="checkbox"
              v-model="form.rescueDemands"
              :value="rescueDemand.rescueDemandId"
            />
            {{ rescueDemand.rescueDemand }}</label
          >
        </div>
      </div>

      <div class="form-group form-single-row">
        <label for="reason" class="required">救援原因</label>
        <textarea
          id="reason"
          v-model="form.rescueReason"
          placeholder="請描述救援原因..."
          required
        ></textarea>
      </div>

      <div class="form-group form-single-row">
        <label for="details">詳細說明</label>
        <textarea
          id="details"
          class="from-details"
          v-model="form.details"
          placeholder="請輸入案件詳細說明..."
        ></textarea>
      </div>

      <div class="form-group form-single-row">
        <label class="required">通報人可負擔事項(多選)</label>
        <div class="checkbox-group">
          <label v-for="canAfford in canAffords" :key="canAfford.canAffordId">
            <input
              type="checkbox"
              v-model="form.canAffords"
              :value="canAfford.canAffordId"
            />
            {{ canAfford.canAfford }}</label
          >
        </div>
      </div>

      <div class="form-group form-single-row">
        <label class="required">圖片上傳(至少一張)</label>
        <div class="upload-image">
          <ImageUpload
            v-for="(picture, index) in form.casePictures"
            :key="index"
            :imageUrl="picture.pictureUrl"
            @image-uploaded="handleImageUploaded(index, $event)"
          />
        </div>
      </div>
      <button type="submit" class="submit-button">確定送出</button>
    </form>
  </div>
</template>

<script setup>
import ImageUpload from "./ImageUpload.vue";
import { useRouter } from "vue-router";
import { ref, onMounted, watch, reactive } from "vue";
import { axiosapi2 } from "@/plugins/axios.js";
import { useRoute } from "vue-router";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const router = useRoute(); //專門用來讀取當前路由資訊
const route = useRouter(); //專門用來跳轉頁面
const caseId = router.params.id; // 從路徑中獲取 ID
console.log("獲取的案件 ID:", caseId);

//從後端提取表單選項資料
const furColors = ref([]);
const cities = ref([]);
const districts = ref([]);
const breeds = ref([]);
const speciesList = ref([]);
const rescueDemands = ref([]);
const canAffords = ref([]);

// 用來傳送資料給後端
const form = reactive({
  caseStateId: "",
  caseTitle: "",
  speciesId: "",
  breedId: "",
  furColorId: "",
  cityId: "",
  districtAreaId: "",
  street: null,
  suspLost: false,
  rescueDemands: [],
  tag: null,
  rescueReason: "",
  canAffords: [],
  casePictures: [],
});

onMounted(() => {
  fetchFurColors();
  fetchCities();
  fetchBreeds();
  fetchSpecies();
  fetchRescueDemands();
  fetchCanAffords();
  if (caseId) {
    fetchCaseData();
  }
});

const submitForm = async () => {
  console.log("🚀 送出數據為:", JSON.stringify(form, null, 2));

  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
  const token = parsedUser ? parsedUser.token : null;

  // **建立符合後端 `ModifyRescueCaseDto` 的物件**
  const requestData = {
    caseTitle: form.caseTitle,
    speciesId: form.speciesId,
    breedId: form.breedId,
    furColorId: form.furColorId,
    gender: form.gender,
    sterilization: form.sterilization,
    age: form.age,
    microChipNumber: form.microChipNumber,
    suspLost: form.suspLost,
    cityId: form.cityId,
    districtAreaId: form.districtAreaId,
    street: form.street,
    rescueReason: form.rescueReason,
    caseStateId: form.caseStateId,
    tag: form.tag,
    rescueDemands: form.rescueDemands,
    canAffords: form.canAffords,
    casePictures: form.casePictures, // ✅ 確保 `imageIdandUrl` 轉換完成
  };

  try {
    const response = await axiosapi2.put(
      `/RescueCase/modify/${caseId}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("表單提交成功:", response.data);
    route.push("/pet/rescue/search"); // 成功後跳轉到 search 頁面
  } catch (error) {
    console.error("表單提交失敗:", error);
    alert("提交失敗，請重試！");
  }
};

//提取物種資料
const fetchSpecies = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allSpecies`);
    speciesList.value = response.data;
  } catch (error) {
    console.error("無法獲取物種資料:", error);
  }
};

//提取毛色資料
const fetchFurColors = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allFurColor`);
    furColors.value = response.data;
  } catch (error) {
    console.error("無法獲取毛色資料:", error);
  }
};

//提取縣市資料
const fetchCities = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allCity`);
    cities.value = response.data;
  } catch (error) {
    console.error("無法獲取縣市資料:", error);
  }
};

//藉由縣市id提取鄉鎮區資料
// 獲取對應縣市的鄉鎮區
const fetchDistricts = async (selectedCityId) => {
  if (!selectedCityId) {
    districts.value = []; // 清空鄉鎮區
    return;
  }
  try {
    const response = await axiosapi2.get(
      `/pet/districtAreasByCity/${selectedCityId}`
    );
    districts.value = response.data;
  } catch (error) {
    console.error("無法獲取鄉鎮區資料:", error);
  }
};

// 監聽 cityId 的變化，動態加載對應的鄉鎮區
watch(
  () => form.cityId,
  (newCityId) => {
    fetchDistricts(newCityId);
  }
);

//提取品種資料
const fetchBreeds = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allBreed`);
    breeds.value = response.data;
  } catch (error) {
    console.error("無法獲取品種資料:", error);
  }
};

//提取救援需求資料
const fetchRescueDemands = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allRescueDemands`);
    rescueDemands.value = response.data;
  } catch (error) {
    console.error("無法獲取救援需求資料:", error);
  }
};

//提取可負擔資料
const fetchCanAffords = async () => {
  try {
    const response = await axiosapi2.get(`/pet/allCanAffords`);
    canAffords.value = response.data;
  } catch (error) {}
};

// 監聽圖片上傳事件
const ImageUploaded = (backTmpUrl) => {
  console.log("父組件拿到囉!", backTmpUrl);
  form.casePictures.push(backTmpUrl);
  console.log("新增圖片進表單", form);
};

// 藉由網頁路徑中拿取的caseId向後端請求案件數據
const fetchCaseData = async () => {
  //解析出token
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
  const token = parsedUser ? parsedUser.token : null;

  console.log("token為", token);

  try {
    const response = await axiosapi2.get(`/RescueCase/editSearch/${caseId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data) {
      console.log("熱騰騰獲取到的案件數據:", response.data);

      // 解析後端返回的 casePictures
      let pictures = response.data.casePictures.map((pic, index) => ({
        casePictureId: parseInt(pic.casePictureId, 10) || null, // 確保 ID 是數字
        pictureUrl: pic.pictureUrl || "",
      }));

      console.log("初始的 casePictures:", pictures);

      // **補齊 3 張圖片**
      while (pictures.length < 3) {
        pictures.push({
          casePictureId: null, // 新增的圖片沒有 ID
          pictureUrl: "",
        });
      }

      console.log("補齊後的 casePictures:", pictures);

      // **先填充其他資料，避免 casePictures 被覆蓋**
      Object.assign(form, response.data);

      // **確保 form.casePictures 不會被覆蓋**
      form.casePictures = pictures;

      console.log("✅ 修補後的 casePictures:", form.casePictures);
      console.log("✅ 修補完的表單數據:", form);
    } else {
      console.log("案件不存在或返回空數據");
    }
  } catch (error) {
    console.error("獲取案件數據失敗:", error);
  }
};

//使用者上傳新圖片時，會替換 casePictures 陣列中的對應圖片
const handleImageUploaded = (index, newImageUrl) => {
  if (form.casePictures[index]) {
    form.casePictures[index].pictureUrl = newImageUrl; // 更新對應索引的圖片
  } else {
    form.casePictures[index] = {
      casePictureId: null, // 新增的圖片，無 ID
      pictureUrl: newImageUrl,
    };
  }
  console.log("更新圖片:", form.casePictures);
};
</script>
<style scoped>
.form-container {
  display: flex;
  justify-content: flex-end; /* 讓按鈕靠右對齊 */
  max-width: 2000px;
  margin: 0 20px;
  padding: 65px 50px;
  background: #e5e2e5;
  border-radius: 10px;
  box-shadow: -7px 7px 3px #c7b07897;
  margin-bottom: 50px;
}

label.required::before {
  content: "*";
  color: red;
  margin-right: 4px;
  font-weight: bold;
}

.form-caseState {
  width: 150px;
  margin-bottom: 10px;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  /* text-align: center; */
}

.form-group {
  color: red;
  margin: 15px 10px 15px 10px;
  font-weight: 600;
}

.optional {
  font-weight: 400;
  font-size: 14px;
}

.form-single-row {
  margin-top: 30px;
}

label {
  display: block;
  font-size: 15px;
  margin-bottom: 5px;
  color: #333;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

textarea {
  resize: none;
  height: 80px;
}

.from-details {
  height: 140px;
}

.checkbox-group label {
  display: inline-block;
  align-items: center;
  margin-right: 30px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 400;
}

.checkbox-group input {
  width: 8px;
  margin-right: 3px;
  cursor: pointer;
}

.upload-image {
  margin-top: 10px;
  display: flex;
  gap: 20px; /* 設定元素之間的間距為 20px */
  flex-wrap: wrap; /* 如果內容超過父容器，允許換行，確保響應模設計 */
}

.submit-button {
  margin-top: 20px;
  width: 200px;
  padding: 10px;
  background-color: #feba07;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #f2d17d;
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.form-row .form-group {
  flex: 1;
}
</style>
