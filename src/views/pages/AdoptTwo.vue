<template lang="html">
  <div v-if="rescueCase">
   <div class="rescue-page">
     <h1>{{ rescueCase.caseTitle }}</h1>
     <div class="second-container">
       <div class="main-content">
         <AdoptTwoUnit />
         <div class="edit-button">
           <div v-if="canEdit && rescueCase" class="member-buttons">
<<<<<<< HEAD
             <router-link :to="`/pet/rescueCase/edit/${rescueCase.rescueCaseId}`" class="router-link">
               <button @click="editCase">編輯案件</button>
             </router-link>
             <router-link :to="`/pet/rescueCase/update/${rescueCase.rescueCaseId}`" class="router-link">
               <button @click="updateProgress">進度更新</button>
             </router-link>
=======
             
            
            
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
           </div>
           <div v-else>
             <button>要求共同編輯權限</button>
           </div>
         </div>
         <div class="share-buttons">
           <a href="#">分享至 Facebook</a>
           <a href="#">分享至 Line</a>
         </div>
         <div class="rescue-details">
           <div class="rescue-reason">
             <CaseRescueReason v-if="rescueCase" :rescueReason="rescueCase" />
           </div>
           <div class="rescue-progress">
             <CaseRescueProgress v-if="rescueCase" :rescueProgress="rescueCase" />
             <ProgressDetail
               v-for="progress in rescueProgressList"
               :key="progress.rescueProgressId"
               :progress-detail="progress.progressDetail"
               :create-time="progress.createTime"
               :image-url="progress.imageUrl"
             />
           </div>
         </div>
         <div class="comments-section">
           <h3>留言區</h3>
           <textarea placeholder="新增留言..."></textarea>
           <button>提交留言</button>
         </div>
       </div>
       <div class="sidebar">
         <div class="support-button">
           <router-link to="/pet/rescue/add" class="button-link">
<<<<<<< HEAD
             新增救援資訊
           </router-link>
         </div>
         <div class="advertisement">
           <p>工商</p>
         </div>
=======
             領養人聯絡資料
             
           </router-link>
         </div>
       
>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
       </div>
     </div>
   </div>
  </div>
  <p v-else>案件資料載入中...</p>
  </template>


  <script setup> 
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { axiosapi } from '@/plugins/axios';
  import useUserStore from '@/stores/user.js'; // 載入 Pinia 的 user store
  import AdoptTwoUnit from "@/components/AdoptTwoUnit.vue";


  
  const route = useRoute();
  const rescueCase = ref({});
  const userStore = useUserStore(); // 取得 Pinia 狀態
  
  // 保存案件進度數據
  const rescueProgressList = ref([]);
  
 
  
  
  // 獲取當前登入的 memberId，進而決定是否顯示案件編輯
  const userMemberId = computed(() => {
    console.log("從pinia抓到memberId", userStore.memberId);
    return userStore.memberId});
  
  
 
  </script>
  
  
  <style scoped>
  .member-buttons{
    display: flex;         /* 使用 Flexbox */
    gap: 30px;             /* 設置按鈕間距 */
    justify-content: center;
  }
  
  .member-buttons button,
  .member-buttons .router-link {
    flex: 1; /* 讓按鈕平均分配可用空間 */
    text-align: center; /* 讓按鈕文字置中 */
    min-width: 180px; /* 設置最小寬度，避免按鈕太小 */
  }
  
  h1 {
    font-size: 30px;
    font-weight: 700;
    margin-bottom: 40px;
    letter-spacing: 1px;
  }
  
  
  .rescue-page {
    margin: 35px auto;
    max-width: 1200px;
  
  }
  .sidebar {
    flex: 1 1 20%;
    max-width: 100%;
    margin-top: 30px;
    margin-left: 80px;
    text-align: center;
    flex-direction: column; /* 垂直排列 */
    align-items: center; /* 元素居中對齊 */
    display: flex; /* 使用 Flexbox */
  }
  
  .sidebar .support-button {
    margin-bottom: 40px;
    width: 200px;
  }
  
  .button-link {
    display: inline-block;
    font-weight: 500;
    letter-spacing: 2px; /* 增加字元之間的距離 */
    background-color: #c6bc77;
    color: white;
    padding: 10px 20px;
    font-size: 20px;
    text-align: center;
    text-decoration: none;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    height: 100px;
    width: 200px;
    box-shadow: 0px 2px 2px #6a6a6a;
    line-height: 100px; /* 讓文字垂直置中 */
  }
  
  .button-link:hover {
    background-color: #aca269;
  }
  
<<<<<<< HEAD
  .advertisement {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    width: 70%;
  }
  
  .advertisement img {
    max-width: 100%;
    border-radius: 5px;
  }
=======

>>>>>>> 5b89eede5f1d15b590c47a0bb1d0819ab7adf086
  
  .second-container {
    display: flex;
    flex-direction: row; /* 水平排列 */
    justify-content: space-between; /* 左右分佈 */
    align-items: flex-start; /* 元素頂部對齊 */
  }
  
  .main-content {
    flex: 18; /* 主內容區域占 3 倍空間 */
    display: flex;
    flex-direction: column; /* 垂直排列 SearchForm 和 CaseList */
  }
  
  .edit-button {
    width: 100%;
    text-align: center;
    margin: 30px auto;
  }
  
  .edit-button button {
    background-color: #edeeef;
    color: rgb(63, 63, 63);
    width: 90%;
    height: 70px;
    font-size: 20px;
    font-weight: 600;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    box-shadow: 0px 2px 2px #bbb7b7;
  }
  
  .edit-button button:hover {
    background-color: #cecccc;
  }
  
  .rescue-details {
    margin-top: 70px;
    border-radius: 8px;
    padding: 20px;
  }
  
  .rescue-reason {
    padding-bottom: 30px;
    border-bottom: 3px solid #ddd;
  }
  
  .rescue-progress {
    padding-bottom: 30px;
    border-bottom: 3px solid #ddd;
  }
  
  .rescue-progress h3 {
    font-weight: 500;
  }
  
  .comments-section {
    width: 100%;
    margin-top: 30px;
  }
  
  .comments-section h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .comments-section textarea {
    width: 100%;
    height: 80px;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    resize: none;
  }
  
  .comments-section button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .comments-section button:hover {
    background-color: #0056b3;
  }
  </style>