
<template>
  <div>
    <!-- Title Section -->
    <div class="title">
      <h2>動物認養</h2>
      <div class="dots">
        <span class="dot dot-green"></span>
        <span class="dot dot-beige"></span>
        <span class="dot dot-pink"></span>
      </div>
    </div>

    <!-- Ad Section -->
    <div class="ad">
      <button type="submit">新增送養通報</button>
    </div>

    <!-- Search Form -->
    <form @submit.prevent="searchCases">
      <div class="container">
        <div class="search-section">
          <input class="ww" type="text" placeholder="輸入關鍵字" v-model="keyword" />

          <div class="search-conditions">
            <input type="text" placeholder="案件編號" v-model="caseId" />

            <select v-model="selectedCaseStatement">
              <option value="" disabled selected hidden>選擇案件狀態</option>
              <option v-for="caseStatement in caseStatements" :key="caseStatement.caseStateId" :value="caseStatement.caseStateId">
                {{ caseStatement.caseStatement }}
              </option>
            </select>

            <div>
                <!-- 只有當 cities 加載完成後，選單才會啟用 -->
                <select v-model="cityId" @change="fetchDistricts" :disabled="cities.length === 0">
                  <option value="" disabled selected hidden>縣市</option>
                  <option v-for="city in cities" :key="city.cityId" :value="city.cityId">
                    {{ city.city }}
                  </option>
                </select>
              </div>

              <div>
                <select v-model="district">
                  <option value="" disabled selected hidden>鄉鎮區</option>
                  <option v-for="district in districts" :key="district.distinctAreaId" :value="district.distinctAreaName">
                    {{ district.distinctAreaName }}
                  </option>
                </select>
              </div>
          </div>

          <!-- Filters (Checkboxes) -->
          <div class="checkbox-container">
            <input type="checkbox" class="custom-checkbox" id="cat" v-model="filters.cat" />
            <label for="cat">貓</label>

            <input type="checkbox" class="custom-checkbox" id="dog" v-model="filters.dog" />
            <label for="dog">狗</label>

            <input type="checkbox" class="custom-checkbox" id="male" v-model="filters.male" />
            <label for="male">男</label>

            <input type="checkbox" class="custom-checkbox" id="female" v-model="filters.female" />
            <label for="female">女</label>

            <input type="checkbox" class="custom-checkbox" id="neutered" v-model="filters.neutered" />
            <label for="neutered">已結紮</label>
          </div>
        </div>

        <!-- Buttons Section -->
        <div class="b2">
          <button class="btn btn-reset" @click="reloadPage">重設</button>
          <button type="submit" class="btn btn-confirm">確定搜尋</button>
        </div>

        <!-- Note Section -->
        <div class="note">
          小提醒：如果找不到想要的案件，可以外加不填寫「縣市鄉鎮區」，這樣可以擴大搜尋範圍！
        </div>

        <!-- Separator -->
        <div class="separator"></div>
      </div>

      <!-- Search Result Section -->
      <div class="result" v-if="searchResult">
        <img :src="'/images/222.jpg'" alt="失物照片" />
        <div class="result-details">
          <div class="info22">
            <p class="info2"><strong>案件編號：</strong>{{ searchResult.caseId }}</p>
          </div>
          <p class="info2">建立日期：2025-01-31</p>

          <div class="info3">
            <h5>{{ searchResult.title }}</h5>
          </div>

          <div class="info33">
            <p><strong>動物種類：</strong>{{ searchResult.type }}</p>
            <p><strong>動物名稱：</strong>{{ searchResult.name }}</p>
            <p><strong>動物性別：</strong>{{ searchResult.gender }}</p>
            <p><strong>有剪耳：</strong>{{ searchResult.earTipped }}</p>
            <p><strong>可送養地點：</strong>{{ searchResult.location }}</p>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        selectedCaseStatement: '',  // 儲存選中的選項
        caseStatements: [] , // 儲存從後端獲取的案件狀態
        cityId: '',  // 預設為空，當用戶選擇城市後，這裡會更新
        district: '',  // 存儲選中的鄉鎮區
        cities: [],  // 存儲城市數據
        districts: [] , // 存儲鄉鎮區數據
        keyword: '',
        caseId: '',
        status: '',
        filters: {
          cat: false,
          dog: false,
          male: false,
          female: false,
          neutered: false,
        },
        searchResult: {
          title:"[台南市]三花小貓待送養",
          image: "cat-example.jpg",
          caseId: "S17352765407",
          type: "貓",
          name: "澎澎",
          gender: "男",
          earTipped: "是",
          location: "新北市樹林區",
        },
      };
    },
      mounted() {
      this.fetchCaseStatements();  // 當組件掛載時獲取資料
      this.fetchCities();
    },
    methods: {
      async fetchCaseStatements() {
      try {
        const response = await axios.get('http://localhost:8080/api/casestatement');  // 確保使用正確的後端端口
        this.caseStatements = response.data;  // 將資料存入 caseStatements
      } catch (error) {
        console.error("Error fetching case statements:", error);}
      },
      async fetchCities() {
    try {
      const response = await fetch("http://localhost:8080/api/cities");
      const data = await response.json();
      this.cities = data;  // 保存城市數據
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  },
    // 当选中某个城市时，获取该城市的鄉鎮區
    async fetchDistricts() {
    if (this.cityId) {
      try {
        console.log("發送請求到 API，城市 ID:", this.cityId);
        
        // 根據選中的 cityId 發送請求
        const response = await fetch(`http://localhost:8080/api/districts/${this.cityId}`);
        const data = await response.json();
        
        console.log("從 API 獲取的鄉鎮區資料:", data);
        this.districts = data;  // 保存鄉鎮區數據
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    } else {
      this.districts = [];  // 如果沒有選擇城市，清空鄉鎮區
    }
  }
,

      reloadPage() {
        location.reload();  // 重新載入當前頁面
      },
    },
  };
</script>

  
<style scoped>

.info3{
  margin-top: 20px;
}
.info2 {
  margin: 0;
  padding: 0;
}
.info33{
  margin: 0;
  padding: 0;
}
.info22 {
  color:#C6BC77;
  font-size: 20px;
}
.b2{
  padding-top: 10px;
}
h5{
  margin-bottom: 10px;
}

.separator {
  padding-bottom: 20px;
  border-top: 2px solid #000; /* 加粗線 */
  width: 100%; /* 設定線條長度，這裡是 80% */
  margin: 10px 0; /* 顯示與上下 div 之間的間隔 */
}
.result {
padding-left: 210px;
display: flex; 
margin: 0 10px;
padding-right: 20px;
}
.result img {
  width: 200px;  /* 設定寬度為 200px */
  height: 200px; /* 設定高度為 200px */
  object-fit: cover; /* 確保圖片填滿 200x200 的區域且不變形 */
  border-radius: 4%;
  margin-right: 30px;
}

  h2 {
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 550; /* 可根據需要調整字重 */
  margin-bottom: 10px;  /* 讓標題和圓點之間有間距 */
}

/* 圓點容器樣式 */
.dots {
  display: flex;     /* 將圓點排成一行 */
  justify-content: left; /* 使圓點水平置中 */
  gap: 10px;          /* 圓點之間的間距 */
  padding: 10px;
}

/* 圓點的基本樣式 */
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;  /* 圓形 */
}

/* 針對不同顏色的圓點 */
.dot-green {
  background-color: #C6BC77;
}

.dot-beige {
  background-color: #FFFD77;
}

.dot-pink {
  background-color: #FEBA07;
}

  body {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    margin: 0;
    padding: 0;
  }
  
  .header {
    font-family: 'Noto Sans KR', sans-serif;
    background-color: #ffffff;
    padding: 10px 20px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: flex-end;
  }
  
  .menu {
    display: flex;
    gap: 10px;
    width: 727.11px;
    height: 83.45px;
    align-items: center;
  }
  .title{
    padding-left: 210px;
  
  }
  .menu a,
  .menu select {
    font-size: 16px;
    text-decoration: none;
    color: #333;
    padding: 10px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
  }
  
  .menu a:hover,
  .menu select:hover {
    color: #C6BC77;
  }
  form{
    font-family: 'Noto Sans KR', sans-serif;
    margin-right: 350px;
   
  }
  .container {
            width: 730px;
            margin-top: 20px;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            
            padding-bottom: 30px;
        }



        .search-section input {

            width: 700px;
            height: 40px;
            font-size: 16px;
            color: #888888;
            opacity: 100%;
            border-radius: 5px;
            border: none;
            justify-content: center;
        }

        .search-conditions {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
        }

        .search-conditions input {
            width: 167.5px;
            height: 40px;
            font-size: 16px;
            color: #888888;
            border-radius: 5px;
            opacity: 100%;
            border: none;

        }

        .search-conditions select {
            width: 167.5px;
            height: 40px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 5px;
            color: #212121;
            border: none;
        }

        .search-section button {
         
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
            

        }

        .note {
          padding-bottom: 50px;
            color: red;
            font-size: 14px;
            margin-top: 20px;
            text-align: center;
        }
  /* 其他樣式保持不變 */
  .custom-checkbox {
            display: none;
        }

        /* 自定義 checkbox 的樣式 */
        .custom-checkbox+label {
            position: relative;
            padding-left: 30px;
            /* 調整 checkbox 與文字之間的距離 */
            cursor: pointer;
            font-size: 18px;
        }

        .custom-checkbox+label::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 20px;
            height: 20px;
            border: 2px solid #333;
            border-radius: 4px;
            background-color: #fff;
            transition: background-color 0.3s, border-color 0.3s;
        }

        /* 當 checkbox 被選中時，改變 checkbox 外觀 */
        .custom-checkbox:checked+label::before {
            background-color: #FEBA07;
            border-color: #FEBA07;
        }

        .custom-checkbox:checked+label::after {
            content: '✔';
            position: absolute;
            top: 0;
            left: 3px;
            font-size: 18px;
            color: white;
        }

        /* 控制 checkbox 和其他 checkbox 之間的間距 */
        .checkbox-container {
          padding-top: 10px;
            display: flex;
            gap: 20px;
            /* 控制 checkbox 之間的距離 */
            align-items: center;
            margin: 10px
        }
        .btn {
      font-size: 16px;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin: 0 10px; /* 讓兩個按鈕之間有一點間距 */
    }

    .btn-reset {
 /* 淡灰色背景 */
  color: #000;                /* 黑色文字 */
  border: 1px solid #333;     /* 深色邊框 */
  padding: 10px 20px;         /* 增加內邊距 */
  cursor: pointer;           /* 鼠標懸停時顯示手形指針 */
}
.ad2 h3{
  float: right;  /* 讓 div 浮動到右邊 */
  right: 100px;

  padding-top: 250px;
  font-size: 20px;
  font-weight: bold;  
  margin-right: 0px;
  
}
.ad button{
  width: 200px;
  height: 100px;
  background-color: #C6BC77;    
  color: #fff;                  /* 白色文字 */
  border: none;                 /* 無邊框 */
  padding: 10px 20px;           /* 增加內邊距 */
  cursor: pointer;             /* 當鼠標懸停時顯示手形指針 */
  font-size: 20px;
      padding: 8px 16px;
      border-radius: 7px;
      float: right;  /* 讓 div 浮動到右邊 */
  margin-top: 100px; /* 可以加入一些上邊距 */
  right: 20px; /* 右邊距離 20px */
  margin-right: 200px; /* 可以設定與右邊的間隔 */
  padding-top: 40px;
  box-shadow: 0px 3px 0px rgba(147, 135, 6, 0.947); /* 下陰影效果 */
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s; /* 讓變色過渡更平滑 */
}
.ad button:hover {
  background-color: #A89E50;  /* 懸停時改變背景顏色 */
 
  box-shadow: 0px 3px 0px rgba(147, 135, 6, 0.947); /* 下陰影效果 */
}

.btn-confirm {
  background-color: #C6BC77;    
  color: #fff;                  /* 白色文字 */
  border: none;                 /* 無邊框 */
  padding: 10px 20px;           /* 增加內邊距 */
  cursor: pointer;             /* 當鼠標懸停時顯示手形指針 */
}

  </style>
  