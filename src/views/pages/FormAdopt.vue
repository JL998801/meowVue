<template>
  <div class="container">
    <h5>新增送養通報</h5>
    <span class="dot dot-green"></span>
    <span class="dot dot-beige"></span>
    <span class="dot dot-pink"></span>

    <div class="section-title">
      <h6>送養通報表單</h6>
    </div>
    <form @submit.prevent="submitForm">
      <label for="caseTitle">*項目標題</label>
      <input type="text" id="caseTitle" v-model="caseTitle" placeholder="請輸入標題，愛牠先有保障！">


      <div class="gg">
        <label for="speciesId" class="a">*動物類別
          <label for="city" class="b">*縣市 </label>
          <label for="district" class="c">*鄉鎮區</label>
        </label>
      </div>

      <div class="form-group">
        <select id="speciesId" v-model="selectedAnimalCategory">
          <option value="" disabled selected hidden></option>
          <option v-for="category in animalCategories" :key="category.speciesId" :value="category.speciesId">
            {{ category.species }}
          </option>
        </select>

        <select v-model="cityId" @change="fetchDistricts" :disabled="cities.length === 0">
          <option value="" disabled selected hidden></option>
          <option v-for="city in cities" :key="city.cityId" :value="city.cityId">
            {{ city.city }}
          </option>
        </select>

        <select v-model="district" :disabled="districts.length === 0">
          <option value="" disabled hidden>選擇鄉鎮區</option>
          <option v-for="district in districts" :key="district.districtAreaId" :value="district.districtAreaId">
            {{ district.districtAreaName }}
          </option>
        </select>
      </div>
            
            <label>*可送養範圍</label>
            <div class="checkbox-group">
                <input type="checkbox" id="A" name="species"><label for="dog">台北市</label>
                <input type="checkbox" id="B" name="species"><label for="cat">基隆市</label>
                <input type="checkbox" id="C" name="species"><label for="cat">宜蘭縣</label>
                <input type="checkbox" id="D" name="species"><label for="cat">新北市</label>
                <input type="checkbox" id="E" name="species"><label for="cat">新竹市</label>
                <input type="checkbox" id="F" name="species"><label for="cat">新竹縣</label>
                <input type="checkbox" id="F" name="species"><label for="cat">桃園市</label>
                <input type="checkbox" id="H" name="species"><label for="cat">南投縣</label>
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="A" name="species"><label for="dog">台中市</label>
                <input type="checkbox" id="B" name="species"><label for="cat">彰化縣</label>
                <input type="checkbox" id="C" name="species"><label for="cat">苗栗縣</label>
                <input type="checkbox" id="D" name="species"><label for="cat">雲林縣</label>
                <input type="checkbox" id="E" name="species"><label for="cat">台南市</label>
                <input type="checkbox" id="F" name="species"><label for="cat">嘉義市</label>
                <input type="checkbox" id="G" name="species"><label for="cat">嘉義縣</label>
                <input type="checkbox" id="H" name="species"><label for="cat">屏東縣</label>

            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="A" name="species"><label for="dog">高雄市</label>
                <input type="checkbox" id="B" name="species"><label for="cat">台東縣</label>
                <input type="checkbox" id="C" name="species"><label for="cat">花蓮縣</label>
                <input type="checkbox" id="D" name="species"><label for="cat">南海諸島</label>
                <input type="checkbox" id="E" name="species"><label for="cat">澎湖縣</label>
                <input type="checkbox" id="F" name="species"><label for="cat">連江縣(馬祖)</label>
                <input type="checkbox" id="G" name="species"><label for="cat">金門縣</label>
         

            </div>
            
        
            <label for="animal-name">*動物名稱</label>
      <input type="text" id="animal-name" placeholder="請輸入動物名稱" v-model="animalName">

      <label for="animal-breed">*動物品種</label>
      <select id="animal-breed" v-model="selectedBreed">
        <option value="" disabled selected hidden>選擇動物品種</option>
        <option v-for="breed in breedList" :key="breed.breedId" :value="breed.breedId">
          {{ breed.breed }}
        </option>
      </select>

      <label for="sterilization">*結紮狀況</label>
        <select id="sterilization" v-model="sterilization">
          <option value="yes">是</option>
          <option value="no">否</option>
        </select>


        <label for="story">*送養原因</label>
        <textarea id="story" v-model="story"></textarea>


        <label for="healthCondition">*健康狀況說明</label>
        <textarea id="healthCondition" v-model="healthCondition"></textarea>


        <label for="adoptedCondition">*領養條件</label>
        <textarea id="adoptedCondition" v-model="adoptedCondition"></textarea>


      <label>項目圖片</label>
      <div class="image-upload">
          <input type="file" ref="file1" @change="handleFileChange(0)" />
        </div>
        <div class="image-preview">
          <img v-if="imagePreviews[0]" :src="imagePreviews[0]" alt="Image Preview" />
        </div>

      <button type="submit">確定送出</button>
    </form>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { axiosapi } from '@/plugins/axios';
import Swal from 'sweetalert2'; // 引入 SweetAlert2

const router = useRouter();

// 状态数据
const selectedFiles = ref([null]); // 用來儲存圖片檔案，現在只需要一個
const imagePreviews = ref([null]); // 用來儲存圖片預覽，現在只需要一個
const animalCategories = ref([]);              // 用來儲存從資料庫取得的動物類別
const selectedAnimalCategory = ref('');        // 用來綁定選擇的動物類別
const breedList = ref([]); 
const cityId = ref(''); // 用來儲存選擇的城市 ID
const district = ref(''); // 用來儲存選擇的區域
const cities = ref([]); // 存放城市資料
const districts = ref([]); // 存放區域資料
const selectedBreed = ref(null);
const caseTitle = ref(''); // 項目標題
const animalName = ref(''); // 動物名稱
const sterilization = ref('yes'); // 結紮狀況
const story = ref(''); // 送養原因
const healthCondition = ref(''); // 健康狀況
const adoptedCondition = ref(''); // 領養條件



// 當選擇文件時觸發
const handleFileChange = (index) => {
  const fileInput = document.querySelectorAll('input[type="file"]')[index];
  const file = fileInput.files[0];

  if (file && file.type.startsWith('image/')) {
    selectedFiles.value[index] = file;
    const reader = new FileReader();
    reader.onload = () => {
      imagePreviews.value[index] = reader.result;
    };
    reader.readAsDataURL(file);
  } else {
    alert("請選擇有效的圖片檔案！");
  }
};



const submitForm = async () => {
  const token = localStorage.getItem('token'); // 假設你的 token 存儲在 localStorage 的 'token' 鍵中
  const memberId = localStorage.getItem('memberId'); // 從 localStorage 取得 memberId

  if (!token || !memberId) {
    alert("未找到認證 token 或會員 ID！");
    return;
  }

  const formData = new FormData();
  selectedFiles.value.forEach((file) => {
    if (file) {
      formData.append("file", file); // 只把圖片文件加進去
    }
  });

  try {
    // 上傳圖片
    const imageResponse = await axiosapi.post(`/Try/Up`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`, // 驗證token
      }
    });

    const imageResult = imageResponse.data; // 假設返回的資料包含圖片URL

    if (imageResult.frontTmpUrl) {
      const caseUrl = [imageResult.frontTmpUrl]; // 將圖片URL放入陣列

      // 將圖片的 tempUrl 存入 localStorage
      localStorage.setItem('imageTempUrls', JSON.stringify(caseUrl));

      // 接下來提交表單資料
      const randomFurColorId = Math.floor(Math.random() * 7) + 1;

      const formDataForAdoption = {
        caseTitle: caseTitle.value,  // 項目標題
        memberId: memberId, // 會員 ID
        speciesId: selectedAnimalCategory.value, // 動物類別
        furColorId: randomFurColorId, // 隨機選擇的 furColorId
        cityId: cityId.value, // 城市
        districtAreaId: district.value, // 區域
        gender: "Male", // 假設為 "Male"
        breedId: selectedBreed.value, // 品種
        sterilization: sterilization.value, // 結紮狀況
        age: 3, // 假設年齡為 3
        microChipNumber: 123456789, // 微晶片號碼
        caseStateId: 1, // 預設為 1
        donationAmount: 0, // 假設捐款為 0
        isHidden: false, // 是否隱藏
        susLost: false, // 是否失蹤
        adoptedCondition: adoptedCondition.value, // 領養條件
        healthCondition: healthCondition.value, // 健康狀況
        note: "This is a sample adoption case", // 備註
        story: story.value, // 送養原因
        caseUrl: caseUrl[0], // 使用圖片的 tempUrl
        name: animalName.value, // 動物名稱
        tag: "dog, adoption", // 標籤
      };

      // 提交表單資料
      const adoptionResponse = await axiosapi.post(`/adoptionsearch/create`, formDataForAdoption, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // 設置 Content-Type 為 application/json
        },
      });

      if (adoptionResponse.data && adoptionResponse.data.success) {
        // 顯示 SweetAlert 成功訊息
        Swal.fire({
          icon: 'success',
          title: '上傳成功!',
          text: '您的案件已成功提交。',
        });

        // 成功後跳轉
<<<<<<< HEAD
        router.push("/adopt");
=======
        router.push("/pages/Adopt");
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
      } else {
        // 處理錯誤情況
        Swal.fire({
          icon: 'success',
          title: '上傳成功!',
          text: '您的案件已成功提交。',
        });

        // 成功後跳轉
<<<<<<< HEAD
        router.push("/adopt");
=======
        router.push("/pages/Adopt");
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: '圖片上傳失敗',
        text: '無法取得圖片的 tempUrl，請稍後再試。',
      });
    }
  } catch (error) {
    console.error("提交表單時發生錯誤:", error);
    Swal.fire({
      icon: 'error',
      title: '提交失敗',
      text: '請稍後再試。',
    });
  }
};





const fetchAnimalBreeds = async () => {
  try {
    const response = await axiosapi.get(`/pet/allBreed`); // 假設您的 API 路徑是這樣
    breedList.value = response.data; // 假設返回的資料是品種資料的陣列
  } catch (error) {
    console.error("Error fetching animal breeds:", error);
  }
};


// 取得動物類別（物種）資料
const fetchAnimalCategories = async () => {
  try {
    const response = await axiosapi.get(`/pet/allSpecies`); 
    animalCategories.value = response.data; // 假設返回的是動物類別的陣列
  } catch (error) {
    console.error("Error fetching animal categories:", error);
  }
};

// 获取城市数据
// 获取城市数据
const fetchCities = async () => {
  try {
    const response = await axiosapi(`/pet/allCity`);
    cities.value = response.data; // 直接使用 response.data
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
};

// 根据城市 ID 获取鄉鎮区
// 根据城市 ID 获取鄉鎮区
const fetchDistricts = async () => {
  if (cityId.value) {
    try {
      const response = await axiosapi(`/pet/districtAreasByCity/${cityId.value}`);
      
      // axios 会自动解析数据，直接访问 response.data
      const data = response.data;
      
      // 确保数据是有效的
      if (Array.isArray(data) && data.length > 0) {
        districts.value = data;
        console.log("已成功取得區域資料：", districts.value);  // 查看是否正常获取数据
      } else {
        console.error("返回的数据格式不符合预期:", data);
        districts.value = [];
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      districts.value = [];
    }
  } else {
    districts.value = [];
  }
};


// 生命周期钩子
onMounted(() => {
  fetchAnimalCategories();
  fetchCities();
  fetchAnimalBreeds();
});
</script>
     

<style scoped>
.dot {
  display: inline-block;
  margin-left: 20px;
  width: 10px;
  height: 10px;
  border-radius: 50%;  /* 圓形 */
}
.dot-green {
    margin-left: 10px;
  background-color: #C6BC77;
}

.dot-beige {
  background-color: #FFFD77;
}

.dot-pink {
  background-color: #FEBA07;
}
h5{
    text-align: center;
}
.a{margin-left: 34px;}
.b{margin-left: 100px;}
.c{margin-left: 100px;;}
body {  
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            display: flex;
            justify-content: center;
            padding: 20px;
        }
        .container {
            font-size: 12px; 
            font-family: 'Noto Sans KR', sans-serif;
            background: rgb(233, 233, 233);
            padding: 20px;
            
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 30%;
        }
        h6 { 
          
            color: #333;
            margin-bottom: 10px;
            margin-top: 20px;
        
        }
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #555;
            margin-bottom: 10px;
        }
        form {
            
            display: flex;
            flex-direction: column;
        }
        label {
            
            font-weight: bold;
            margin-top: 6px;
        }
        input, select, textarea {
            font-family: 'Noto Sans KR', sans-serif;
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .form-group {
            
            display: flex;
            gap: 10px;
        }
 

        .form-group select {
            flex: 1;
            min-width: 20%;
        }
        .checkbox-group {
            
            display: flex;
           
           
        }
        .checkbox-group input {
            
            display: flex;
            width: 20px; 
           
        }
        .checkbox-group label{
            
            margin-right: 10px;
            font-size: 9px;
            display: flex;
            writing-mode: horizontal-tb;
           
           
        }

  

                  /* 讓 image-upload 容器寬度略小於 form 的寬度 */
          .image-upload {
            display: flex;
            gap: 10px;
            justify-content: space-between;  /* 讓三個 input 有均等間隔 */
            width: calc(100% ); /* form 宽度减去20px的间隙 */
            margin: 10px 0;  /* 上下外邊距 */
          }

          /* 設置每個 input 使它們的寬度平均並略小於容器 */
          .image-upload input[type="file"] {
            width: 33%; /* 每個 input 占容器寬度的32%，並留出空隙 */
           
          }

          /* 預覽圖片容器 */
          .image-preview img {
            max-width: 100px;  /* 設定預覽圖片的最大寬度 */
            margin-top: 10px;
            margin-right: 10px;
          }

        button {
            
            margin-top: 20px;
            background-color: #C6BC77;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #655806;
        }
</style>