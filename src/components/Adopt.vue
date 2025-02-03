<template>
    <div>
      <header class="header">
        <nav class="menu">
          <a href="#">首頁</a>
          <select>
            <option>通報案件</option>
            <option>選項 1</option>
            <option>選項 2</option>
          </select>
          <select>
            <option>最新消息</option>
            <option>選項 1</option>
            <option>選項 2</option>
          </select>
          <select>
            <option>近期活動</option>
            <option>選項 1</option>
            <option>選項 2</option>
          </select>
          <a href="#">違規查詢</a>
          <a href="#">精選商店</a>
          <a href="#">會員中心</a>
        </nav>
      </header>
  
      <form @submit.prevent="searchCases">
        <div class="container">
          <div class="search-section">
            <h2>動物認養</h2>
            <input class="ww" type="text" placeholder="輸入關鍵字" v-model="keyword" />
            <div class="search-conditions">
              <input type="text" placeholder="案件編號" v-model="caseId" />
              <select v-model="status">
                <option>結案狀態</option>
                <option>開放領養中</option>
                <option>暫停領養中</option>
                <option>已送養結案</option>
                <option>送養失敗</option>
              </select>
              <select v-model="city">
                <option>縣市</option>
                <option>台北市</option>
                <option>新北市</option>
                <option>桃園市</option>
                <!-- 其他選項省略 -->
              </select>
              <select v-model="district">
                <option>鄉鎮區</option>
                <option>選項 1</option>
                <option>選項 2</option>
              </select>
            </div>
  
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
  
            <button type="submit">搜尋</button>
          </div>
  
          <div class="note">
            小提醒：如果找不到想要的案件，可以外加不填寫「縣市鄉鎮區」，這樣可以擴大搜尋範圍！
          </div>
        </div>
  
        <div class="result" v-if="searchResult">
          <img :src="searchResult.image" alt="失物照片" />
          <div class="result-details">
            <p><strong>案件編號：</strong>{{ searchResult.caseId }}</p>
            <p><strong>動物種類：</strong>{{ searchResult.type }}</p>
            <p><strong>動物名稱：</strong>{{ searchResult.name }}</p>
            <p><strong>動物性別：</strong>{{ searchResult.gender }}</p>
            <p><strong>有剪耳：</strong>{{ searchResult.earTipped }}</p>
            <p><strong>遺失地點：</strong>{{ searchResult.location }}</p>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        keyword: '',
        caseId: '',
        status: '',
        city: '',
        district: '',
        filters: {
          cat: false,
          dog: false,
          male: false,
          female: false,
          neutered: false,
        },
        searchResult: {
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
    methods: {
      searchCases() {
        alert("搜尋功能尚未實現！");
      },
    },
  };
  </script>
  
  <style scoped>
  /* 原始樣式保持不變，直接複製 */
  body {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    margin: 0;
    padding: 0;
  }
  
  .header {
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
    color: #099879;
  }
  
  /* 其他樣式保持不變 */
  </style>
  