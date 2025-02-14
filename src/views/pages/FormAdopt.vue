<template>
 <div class="container">
        <h5>新增送養通報</h5>
        <span class="dot dot-green"></span>
        <span class="dot dot-beige"></span>
        <span class="dot dot-pink"></span>

        <div class="section-title">
            <h6>送養通報表單</h6>
        </div>
        <form>
            <label for="project-name">*項目標題</label>
            <input type="text" id="project-name" placeholder="請輸入標題，愛牠先有保障！">
            

            <div class="gg">
                <label for="animal-category" class="a">*動物類別
                    <label for="city" class="b">*縣市 </label>
                    <label for="district" class="c">*鄉鎮區</label>
            </label></div>

            <div class="form-group">
                
                <select id="animal-category" v-model="selectedAnimalCategory">
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
                
                <select v-model="district">
              <option value="" disabled hidden></option>
              <option v-for="district in districts" :key="district.districtAreaId" :value="district.districtAreaName">
                {{ district.districtAreaName }}
              </option>
            </select>
            </div>
            
            <label>*可送養範圍</label>
            <div class="checkbox-group">
                <input type="checkbox" id="dog" name="species"><label for="dog">台北市</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">基隆市</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">宜蘭縣</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">新北市</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">新竹市</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">新竹縣</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">桃園市</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">南投縣</label>
            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="dog" name="species"><label for="dog">台中市</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">彰化縣</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">苗栗縣</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">雲林縣</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">台南市</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">嘉義市</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">嘉義縣</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">屏東縣</label>

            </div>
            <div class="checkbox-group">
                <input type="checkbox" id="dog" name="species"><label for="dog">高雄市</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">台東縣</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">花蓮縣</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">南海諸島</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">澎湖縣</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">連江縣(馬祖)</label>
                <input type="checkbox" id="cat" name="species"><label for="cat">金門縣</label>
         

            </div>
            
        
            
            <label for="animal-name">*動物名稱</label>
            <input type="text" id="animal-name" placeholder="請輸入動物名稱">
            
            <label for="animal-breed">*動物品種</label>
            <select id="animal-breed"></select>
            
            <label for="sterilization">*結紮狀況</label>
            <select id="sterilization">
            <option value="yes" selected>是</option>
            <option value="no">否</option>
            </select>
            
            
            <label for="adoption-reason">*送養原因</label>
            <textarea id="adoption-reason"></textarea>
            
            <label for="status-description">*健康狀況說明</label>
            <textarea id="status-description"></textarea>
            
            <label for="special-needs">*領養條件</label>
            <textarea id="special-needs"></textarea>
            
            <label>項目圖片</label>
            <div class="image-upload">
                <input type="file">
                <input type="file">
                <input type="file">
            </div>
            
            <button type="submit">確定送出</button>
        </form>
    </div>
</template>


<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const router = useRouter();
const baseUrl = import.meta.env.VITE_API_URL;

// 状态数据
const animalCategories = ref([]); // 用來儲存從資料庫取得的動物類別
const selectedAnimalCategory = ref(''); // 用來綁定選擇的動物類別
const selectedCaseStatement = ref('');
const caseStatements = ref([]);
const cityId = ref('');
const district = ref('');
const cities = ref([]);
const districts = ref([]);
const keyword = ref('');
const caseId = ref('');
const filters = ref({
  cat: false,
  dog: false,
  male: false,
  female: false,
  neutered: false,
});


//物種
// 取得動物類別（物種）資料
const fetchAnimalCategories = async () => {
  try {
    const response = await axios.get(`${baseUrl}/pet/allSpecies`); 
    animalCategories.value = response.data; // 假設返回的是動物類別的陣列
  } catch (error) {
    console.error("Error fetching animal categories:", error);
  }
};

// 获取城市数据
const fetchCities = async () => {
  try {
    const response = await fetch(`${baseUrl}/pet/allCity`);
    const data = await response.json();
    cities.value = data;
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
};

// 根据城市 ID 获取鄉鎮区
const fetchDistricts = async () => {
  if (cityId.value) {
    try {
        const response = await fetch(`${baseUrl}/pet/districtAreasByCity/${cityId.value}`);
      const data = await response.json();
      districts.value = data;
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  } else {
    districts.value = [];
  }
};

// 生命周期钩子
onMounted(() => {
  fetchAnimalCategories();
  fetchCities();
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

        .image-upload {
            display: flex;
            gap: 10px;
            margin-top: 10px;
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