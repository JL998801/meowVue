<template>
  <div class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <button class="close-button" @click="$emit('close')">
          <font-awesome-icon
            icon="fa-solid fa-circle-xmark"
            style="color: rgb(168, 166, 166)"
          />
        </button>
      </div>
      <div class="modal-body">
        <div class="upload-area">
          <label for="file-upload">
            <div class="plus-icon" v-show="!previewImage">
              <font-awesome-icon icon="fa-solid fa-circle-plus" />
            </div>
          </label>
          <p v-show="!previewImage">圖片將上傳至此</p>
          <input
            v-show="!previewImage"
            id="file-upload"
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            hidden
          />
          <div v-if="previewImage" class="cropper-container">
            <img ref="imageRef" :src="previewImage" alt="預覽圖片" />
          </div>
        </div>
        <div class="preview-section">
          <p class="preview-title">圖片預覽：</p>
          <div class="preview">
            <img v-if="croppedImage" :src="croppedImage" alt="裁剪後的圖片" />
            <font-awesome-icon
              v-else
              icon="fa-solid fa-image"
              class="placeholder-icon-container"
            />
          </div>
          <p class="image-note">圖片僅擷取正方形，請注意拍攝角度。</p>
        </div>
      </div>
      <div class="modal-footer">
        <button
          @click="resetUpdload"
          v-show="previewImage"
          class="reset-button"
        >
          重新上傳
        </button>
        <button type="button" @click="confirmUpload" class="confirm-button">
          確定上傳
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import axios from "axios";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const previewImage = ref(null); //  圖片預覽
const croppedImage = ref(null); // 裁剪後的圖片
const cropper = ref(null); // 裁剪器
const imageRef = ref(null); //透過<img ref="image" >綁定而賦值
const emit = defineEmits(["imageUploaded", "close"]); //傳遞裁剪後的圖片&關閉事件給父組件

// step1處理文件上傳
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader(); //將文件轉換為 Base64 格式，供瀏覽器直接預覽圖片
    reader.onload = (e) => {
      //當文件讀取完成時觸發該回調
      previewImage.value = e.target.result; //e.target.result 是 Base64 格式的圖片數據
      nextTick(() => {
        //保證 DOM 結構完成更新後才執行回調。
        initializeCropper(); //確保圖片的預覽元素已經被渲染到頁面中，避免裁剪器初始化時找不到目標圖片
      });
    };
    reader.readAsDataURL(file);
  } else {
    console.error("未選擇文件或文件無效");
  }
};

// step2初始化Cropper當previewImage 有值（即圖片已加載）後，才會調用此方法
const initializeCropper = () => {
  if (cropper.value) {
    cropper.value.destroy();
  }
  console.log("圖片綁訂了", imageRef.value);
  const image = imageRef.value;
  if (image) {
    cropper.value = new Cropper(image, {
      aspectRatio: 1,
      viewMode: 2,
      zoomOnWheel: false, // 禁止滑鼠滾輪縮放
      autoCropArea: 0.7,
      background: true,
      minCropBoxWidth: 100, // 裁剪框最小寬度
      minCropBoxHeight: 100, // 裁剪框最小高度
      rotatable: true, // 允許旋轉
      preview: ".preview", // 預覽區域
    });
  } else {
    console.error("初始化失敗：imageRef.value 為空");
  }
};

// 重置上傳圖片
const resetUpdload = () => {
  if (previewImage.value) {
    previewImage.value = null;
    cropper.value.destroy(); //銷毀剪裁器
  }
};

// 確定上傳
const confirmUpload = async () => {
  if (!previewImage.value) return;

  const formData = new FormData();

  // 🔹 確保 Cropper 已經裁剪完圖片
  if (cropper.value) {
    cropper.value.getCroppedCanvas().toBlob(async (blob) => {
      if (!blob) {
        console.error("裁剪後的 Blob 為 null");
        return;
      }

      formData.append("file", blob, "upload.jpg"); //

      try {
        // 🔹 取出 Token
        const user = localStorage.getItem("user");
        const parsedUser = JSON.parse(user);
        const token = parsedUser?.token || "";

        console.log("前端發送的 Token:", token);

        const response = await axios.post(
          `${baseUrl}/Case/uploadImage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, //
            },
          }
        );
        if (response.data) {
          console.log("返回結果", response.data);
          emit("imageUploaded", {
            frontTmpUrl: response.data.frontTmpUrl,
            backTmpUrl: response.data.backTmpUrl,
          });
          emit("close");
          console.log("上傳圖片成功");
        }
      } catch (error) {
        console.error("上傳圖片失敗:", error.response?.data || error);
      }
    });
  } else {
    console.error("Cropper 尚未初始化");
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
}

.modal-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
}

.modal-content {
  background: white;
  width: 800px;
  height: 500px;
  padding: 20px;
  border-radius: 15px;
}

.close-button {
  position: absolute;
  right: 10px;
  background-color: white;
  border: none;
  font-size: 40px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button :hover {
  color: rgb(134, 133, 133);
}

.upload-area {
  width: 400px;
  height: 300px;
  border: 3px dashed #cecdcd;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.upload-area p {
  font-size: 20px;
  color: #cecdcd;
  margin-top: 100px;
}

.plus-icon {
  position: absolute;
  top: 40px;
  left: 40px;
  font-size: 60px;
  color: #feba07;
  transition: color 0.3s ease;
}

.plus-icon :hover {
  color: #f2d17d;
  cursor: pointer;
}

.preview {
  width: 200px;
  height: 200px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 12px;
  margin-left: 20px;
  position: relative;
}

.placeholder-icon-container {
  font-size: 50px; /* 設定圖示大小 */
  color: #ccc; /* 設定圖示顏色 */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 讓圖示以自身中心點對齊容器中心 */
}

.image-note {
  color: red;
  margin-top: 20px;
  font-size: 15px;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
}
.reset-button {
  border: none;
  width: 150px;
  background-color: #ddd;
  color: #333;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.reset-button:hover {
  color: #333;
  background-color: #f2f2f2;
  cursor: pointer;
}

.confirm-button {
  border: none;
  width: 200px;
  background-color: #feba07;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #f2d17d;
}

.preview-title {
  color: #333;
  font-size: 20px;
  font-weight: 400;
}
</style>
