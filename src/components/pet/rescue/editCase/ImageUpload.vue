<template>
  <div class="image-upload">
    <div class="image-preview">
      <img v-if="image" :src="image" alt="圖片預覽" class="preview-image" />
      <font-awesome-icon
        v-else
        icon="fa-solid fa-image"
        class="placeholder-icon"
      />
    </div>
    <button type="button" @click="openUploadModal" class="upload-button">
      上傳圖片
    </button>
  </div>

  <!-- 圖片裁剪模態框子組件-->
  <ImageUploadModal
    v-if="isModalOpen"
    @close="closeUploadModal"
    @imageUploaded="handleImageUploaded"
  />
</template>x

<script setup>
import ImageUploadModal from "./ImageUploadModal.vue";
import { ref, defineProps, defineEmits } from "vue";

// **接收來自父組件的圖片 URL**
const props = defineProps({
  imageUrl: String, // 這樣 Vue 會將圖片 URL 傳入組件
});

const image = ref(props.imageUrl || ""); // 預設圖片來自 props
const emit = defineEmits(["image-uploaded"]); // 定義事件，將 圖片於後端server的URL傳給父組件


const isModalOpen = ref(false); //圖片模態框預設為關閉

// 打開模態框
const openUploadModal = () => {
  isModalOpen.value = true;
};
// 關閉模態框
const closeUploadModal = () => {
  isModalOpen.value = false;
};

// // 處理裁剪後的圖片
// const handleImageUploaded = ({ frontTmpUrl, backTmpUrl }) => {
//   console.log("給前端呼叫圖片 URL:", frontTmpUrl);
//   console.log("後端儲存的圖片 URL:", backTmpUrl);
//   image.value = frontTmpUrl; // 每次上傳都會覆蓋之前的圖片，導致最終只有一張
//   emit("image-uploaded", backTmpUrl); //傳遞給父組件新增案件contoller使用的圖片URL
//   closeUploadModal();
// };

// 處理圖片上傳
const handleImageUploaded = (newImageUrl) => {
  image.value = newImageUrl.frontTmpUrl; // 更新圖片
  emit("image-uploaded", newImageUrl.frontTmpUrl); // 傳遞新圖片 URL 給 `EditCaseForm.vue`
};
</script>

<style scope>
.image-upload {
  display: inline-block; /* 確保組件是 inline */
  width: 150px; /* 固定每個子組件的寬度 */
}

.image-preview {
  width: 150px;
  height: 150px;
  background-color: #f8f8f8;
  border: 1px solid #c7c7c7;
  border-radius: 10px;
}

/*固定上傳圖片後呈現樣式*/
.preview-image {
  width: 150px;
  height: 150px;
  object-fit: cover; /* 裁切圖片以填滿容器 */
  border: 1px solid #ddd;
  border-radius: 10px;
}

.placeholder-icon {
  font-size: 30px; /* 設定圖示大小 */
  color: #707070; /* 設定圖示顏色 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 60px;
  margin-top: 60px;
}

.upload-button {
  width: 150px;
  height: 40px;
  padding: 5px;
  background-color: #feba07;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
