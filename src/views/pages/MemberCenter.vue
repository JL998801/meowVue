<template>
    <div class="rel flex justify-b px-150 py-8 min-h">
      <!-- 會員中心 -->
      <div class="w-full max-w bg-w shadow-lg rounded p-6">
        <h2 class="text-2x font-b text-gray-7 center mb-4">會員中心</h2>
        <div class="profile-pic-container">
  <!-- 上傳圖片選擇 -->
  <div class="profile-pic-container">
        <!-- 隱藏input並且點擊圖片選擇文件 -->
        <input type="file" class="profile-pic" @change="handleFileChange(0)" style="display: none;" ref="fileInput">


        <!-- 點擊圖片預覽，觸發input選擇圖片 -->
        <img 
                v-if="imagePreviews[0]" 
                :src="imagePreviews[0]" 
                alt="Profile Preview" 
                class="profile-pic-preview" 
                @click="triggerFileInput"
                >
                <img 
                v-else 
                :src="caseUrl" 
                alt="Profile Picture" 
                class="profile-pic" 
                @click="triggerFileInput"
>
      </div>
</div>

<!-- 按鈕，點擊後觸發圖片上傳 -->
<button @click="submitForm" class="bg-bu text-w px-3 py-1 rounded text-sm">上傳圖片</button>



        <div class="flex-col items-c my-4">
          <h3 class="text-lg font-s mt-2">{{ nickname }}</h3>
          <p class="text-gray-5 text-sm">會員 ID：<span class="qq font-b">{{ memberId }}</span></p>
          <div class="mt-2 flex gap-2">
            <button class="bg-bu text-w px-3 py-1 rounded text-sm">已驗證手機</button>
            <button class="bg-re text-w px-3 py-1 rounded text-sm">未連動 Line Notify</button>
          </div>
        </div>
  
        <!-- 案件數 -->
        <div class="gap-4 text-center">
        <div class="p-4 bg-w border rounded shadow">
          <p class="text-xl font-b text-gray-7">{{ rescueCaseCount }}</p>
          <p class="text-gray-5 text-sm">救援案件數</p>
        </div>
        <div class="p-4 bg-w border rounded shadow">
          <p class="text-xl font-b text-gray-7">{{ adoptionCaseCount }}</p>
          <p class="text-gray-5 text-sm">送養案件數</p>
        </div>
          <div class="p-4 bg-w border rounded shadow">
            <p class="text-xl font-b text-gray-7">0</p>
            <p class="text-gray-5 text-sm">遺失案件數</p>
          </div>
          <div class="p-4 bg-w border rounded shadow">
            <p class="text-xl font-b text-gray-7">0</p>
            <p class="text-gray-5 text-sm">領養案件數</p>
          </div>
        </div>
  
        <!-- 最新公告與通知 -->
        <div class="bg-gray-5 p-4 rounded shadow">
          <h3 class="text-lg font-s text-gray-7">最新公告與通知</h3>
          <p class="text-gray-5 text-sm mt-2 leading-r">
            歡迎回到壁爐之家！！<br />
            非常感謝您的加入，<br />
            希望各位會員都能夠一起參與網站上的通報案件，無論是救援、送養/認養、協尋，<br />
            一起發揮力量，讓更多需要救援的浪浪度過難關，無家可歸的浪浪找到溫暖的家，迷路在外的毛孩點點回家。
          </p>
        </div>
      </div>
  
      <!-- 功能選單 -->
      <aside >
        <SidebarMenu class="fixed-sidebar "/>
      </aside>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import SidebarMenu from "@/components/SidebarMenu.vue";
  import { axiosapi } from '@/plugins/axios';
  const selectedFiles = ref([null]);  // 儲存選擇的檔案
  const imagePreviews = ref([null]);  // 儲存圖片預覽
  const rescueCaseCount = ref(0);  // 救援案件數
  const adoptionCaseCount = ref(0);  // 送養案件數
  const caseUrl = ref('');
  const fileInput = ref(null);
  const nickname = ref('');
  const memberId = ref('');
  const router = useRouter();


  onMounted(() => {
  // 當組件掛載後，從 localStorage 取出 nickname 和 memberId
  const storedNickname = localStorage.getItem('nickname');
  const storedMemberId = localStorage.getItem('memberId');
  const storedClientId = localStorage.getItem('googleClientId');  // 取出 clientId

  // 如果 localStorage 中有 googleClientId，將 googleClientId，設為memberId
  if (!storedNickname && storedClientId) {
    nickname.value = "Jude Chu";
    localStorage.setItem('nickname', "Jude Chu");  
  } else if (storedNickname) {
    nickname.value = storedNickname;
  }

  // 優先顯示 memberId，若不存在則顯示 googleClientId 的前 12 個字符
  if (storedMemberId) {
    memberId.value = storedMemberId;
  } else if (storedClientId) {
    memberId.value = storedClientId.slice(0, 12);  // 取前 12 個字符
  }



  const storedImageUrl = localStorage.getItem('caseUrl');
  if (storedImageUrl) {
    try {
      // 解析圖片 URL，如果是 JSON 字符串的話
      const parsedImageUrls = JSON.parse(storedImageUrl);
      caseUrl.value = parsedImageUrls.length > 0 ? parsedImageUrls[0] : '';  // 顯示第一張圖片
    } catch (e) {
      // 若解析錯誤，直接用原始的字符串
      caseUrl.value = storedImageUrl;
    }
  }

  fetchAdoptionCases();
});

// 觸發文件選擇框
const triggerFileInput = () => {
  fileInput.value.click();  // 觸發 input 的 click 事件
};

// 處理文件選擇
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

  // 如果 token 或 memberId 不存在，給予提示並停止執行
  if (!token || !memberId) {
    alert("未找到認證 token 或會員 ID！");
    return;
  }

  // 檢查是否選擇了文件
  if (selectedFiles.value.length === 0) {
    alert("請選擇一個文件！");
    return;
  }

  const formData = new FormData();

  // 遍歷所有選擇的文件，並將其添加到 FormData
  selectedFiles.value.forEach((file) => {
    if (file) {
      formData.append("file", file); // 只把圖片文件加進去
    }
  });

  try {
    // 發送 POST 請求，上傳圖片
    const imageResponse = await axiosapi.post('/Try/Up', formData, {
      headers: {
        'Authorization': `Bearer ${token}`, // 添加 Authorization header 傳送 token
      },
    });

    // 如果成功返回圖片 URL，處理它
    if (imageResponse.data.frontTmpUrl) {
      const caseUrl = [imageResponse.data.frontTmpUrl]; // 將圖片 URL 放入陣列中

      // 將圖片的 tempUrl 存入 localStorage
      localStorage.setItem('caseUrl', JSON.stringify(caseUrl));

      // 刷新頁面
      window.location.reload();
    } else {
      // 如果沒有返回圖片 URL，處理錯誤
      alert("上傳成功，但未返回圖片 URL！");
    }
  } catch (error) {
    // 捕捉並處理錯誤
    console.error("上傳失敗:", error);

    // 根據錯誤的不同情況，顯示適當的提示信息
    if (error.response) {
      // 服務器返回錯誤
      alert(`上傳失敗: ${error.response.data.message || '未知錯誤'}`);
    } else if (error.request) {
      // 請求發送成功但沒有收到回應
      alert("無法連接到伺服器，請檢查網絡連接！");
    } else {
      // 發生錯誤時，顯示的錯誤
      alert(`上傳失敗: ${error.message}`);
    }
  }
};

const fetchAdoptionCases = async () => {
  try {
    const memberId = localStorage.getItem('memberId');
    if (!memberId) {
      console.error("未找到會員ID！");
      return;
    }

    const response = await axiosapi.get('/adoptionsearch/count', {
      params: {
        memberId: memberId,
      },
    });

    // 假設返回的是數字類型的案件數量
    adoptionCaseCount.value = response.data; // 直接將返回的數量賦值給 adoptionCaseCount
  } catch (error) {
    console.error("獲取送養案件數時出錯:", error);
  }
};



  </script>
  
  <style scoped>
  /* 基础全局样式 */
  
/* 預覽圖片 */
.profile-pic-container {
  position: relative;
  width: 150px;
  height: 150px;
}

/* 這是大頭貼 */
.profile-pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;  /* 圓形顯示 */
  object-fit: cover;   /* 保持圖片比例，並裁剪超出部分 */
  border: 3px solid #333; /* 邊框 */
  position: absolute;
  top: 0;
  left: 0;
}

/* 預覽圖片 */
.profile-pic-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  position: absolute; /* 使其重疊於大頭貼 */
  top: 0;
  left: 0;
}
  .fixed-sidebar {
  position: fixed;
  top: 200px;
  right: 20px;
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
  body {
      background-color: #f7fafc;
  }

  .rel {
      position: relative;
  }

  .flex {
      display: flex;
  }

  .justify-b {
      justify-content: space-between;
  }

  .px-150 {
      padding-left: 150px;
      padding-right: 150px;
  }

  .py-8 {
      padding-top: 2rem;
      padding-bottom: 2rem;
  }

  .min-h {
      min-height: 100vh;
  }

  /* 会员中心 */
  .w-full {
      width: 100%;
  }

  .max-w {
      max-width: 56rem;
  }

  .bg-w {
      background-color: #ffffff;
  }

  .bg-bu {
      background-color: #3b82f6;
  }

  .bg-re {
      background-color: #f87171;
  }

  .bg-gray-5 {
      background-color: #f9fafb;
  }

  .bg-g {
      background-color: #C6BC77;
  }

  .text-w {
      color: #ffffff;
  }

  .text-gray-7 {
      color: #4a5568;
  }

  .text-gray-5 {
      color: #a0aec0;
  }

  .text-lg {
      font-size: 1.125rem;
  }

  .text-2x {
      font-size: 1.5rem;
  }

  .text-xl {
      font-size: 1.25rem;
  }

  .text-sm {
      font-size: 0.875rem;
  }

  .font-b {
      font-weight: 700;
  }

  .font-s {
      font-weight: 600;
  }

  .center {
      text-align: center;
  }

  .shadow, .shadow-lg {
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .shadow-lg {
      box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  .rounded {
      border-radius: 0.5rem;
  }

  .p-6, .p-4, .p-2 {
      padding: 1.5rem;
  }

  .p-4 {
      padding: 1rem;
  }

  .p-2 {
      padding: 0.5rem;
  }

  .border-2 {
      border-width: 2px;
  }

  .border {
      border-width: 1px;
  }

  .border-gray {
      border-color: #e2e8f0;
  }

  .mb-4, .my-4, .mt-4 {
      margin-bottom: 1rem;
  }

  .mt-2 {
      margin-top: 0.5rem;
  }

  .gap-2 {
      gap: 0.5rem;
  }

  .gap-4 {
      gap: 1rem;
      display: flex; 
  }

  .flex-col {
      flex-direction: column;
  }

  .items-c {
      align-items: center;
  }

  .w-60 {
      width: 15rem;
  }

  .cursor-p {
      cursor: pointer;
  }

  .leading-r {
      line-height: 1.625;
  }

  .space-y-2 {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
  }

  /* 功能選單 */
  .fixed {
      position: fixed;
  }

  .right-150 {
      right: 150px;
  }
</style>
