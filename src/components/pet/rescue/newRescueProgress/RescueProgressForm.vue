<template>
  <h2 class="form-title">進度更新</h2>
  <div class="form-container">
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="reason" class="required">進度更新內容</label>
        <textarea
          id="reason"
          v-model="form.progressDetail"
          placeholder="請描述動物目前救援狀況..."
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label>圖片上傳(可選)</label>
        <div class="upload-image">
          <ImageUpload @image-uploaded="ImageUploaded"></ImageUpload>
        </div>
      </div>

      <div class="submit-button-container">
        <button type="submit" class="submit-button">確定送出</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import ImageUpload from "./ImageUpload.vue";
import { useRouter, useRoute } from "vue-router";
import { reactive } from "vue";
import { axiosapi2 } from "@/plugins/axios.js";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const router = useRoute(); //專門用來讀取當前路由資訊
const route = useRouter(); //專門用來跳轉頁面
const caseId = router.params.id; // 從路徑中獲取 ID
console.log("獲取的案件 ID:", caseId);

// 用來傳送資料給後端   Vue的 reactive會產生 Proxy 物件，可能導致 axios無法正確發送數據，因此要記得轉換
const form = reactive({
  progressDetail: "",
  imageUrl: [],
});

const submitForm = async () => {
  const cleanForm = JSON.parse(JSON.stringify(form));
  console.log("送出數據為 (轉換後)", cleanForm);

  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
  const token = parsedUser ? parsedUser.token : null;

  try {
    const response = await axiosapi2.post(
      `/RescueCase/rescueProgress/add/${caseId}`,
      cleanForm,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("表單提交成功:", response.data);
    route.push(`/pet/rescueCase/${caseId}`); // 成功後跳轉到原本案件頁面
  } catch (error) {
    console.error("表單提交失敗:", error);
    alert("提交失敗，請重試！");
  }
};

// 監聽圖片上傳事件
const ImageUploaded = (backTmpUrl) => {
  console.log("父組件拿到囉!", backTmpUrl);
  form.imageUrl.push(backTmpUrl);
  console.log("新增圖片進表單", form);
};
</script>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  margin: 0 40px;
  padding: 50px 60px;
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

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  /* text-align: center; */
}

.form-group {
  margin: 15px 10px 15px 10px;
  font-weight: 600;
  margin-top: 30px;
}

.form-group textarea {
  max-width: 100%;
  height: 200px;
  width: 600px; /* 為特定 `textarea` 設置固定寬度 */
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
  width: 100%; /* 改為容器的 100% 寬度 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  resize: none; /* 防止用戶自行調整大小 */
  height: 80px;
  max-width: 600px; /* 可選：設置最大寬度，避免過寬 */
}

textarea {
  resize: none;
  height: 80px;
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

.submit-button-container {
  text-align: right;
}
</style>
