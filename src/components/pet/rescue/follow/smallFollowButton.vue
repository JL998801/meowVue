<template>
  <div @click="toggleFollow" class="follow-button">
    <font-awesome-icon icon="fa-solid fa-heart" class="heart-icon" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import Swal from "sweetalert2";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const props = defineProps({
  follow: {
    type: Number,
    required: false, //改為非必填，避免 Vue 警告 因為可能案件data還沒從後端抓來，就沒有follow值
    default: 0, // 給預設值，避免還沒有值的時候為null，不符合Number
  },
  caseId: {
    type: Number,
    required: false, // ✅ 避免 `caseId` 為 undefined 時報錯
  },
  caseType: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["followUpdated"]); // ✅ 新增取消追蹤事件

const followCount = ref(props.follow);
const isFollowing = ref(false);
const route = useRoute();

// 顯示彈窗訊息
const showAlert = (message, icon) => {
  Swal.fire({
    title: "追蹤狀態",
    text: message,
    imageUrl: "http://localhost:8080/upload/final/pet/images/follow-icon.png",
    // icon: icon,
    imageWidth: 150, // 設定寬度
    imageHeight: 120, // 設定高度
    confirmButtonText: "確認",
    timer: 1000, // 設定 1 秒自動關閉
    timerProgressBar: true, // 顯示進度條
    customClass: {
      popup: "custom-swal-popup",
    },
  });
};

// 取得會員登入資訊
const getAuthToken = () => {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  return parsedUser ? parsedUser.token : null;
};

// 切換追蹤狀態
const toggleFollow = async () => {
  const token = getAuthToken();
  if (!token) {
    alert("請先登入才能追蹤案件！");
    return;
  }

  try {
    const response = await axios.put(
      `${baseUrl}/Case/follow/add`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          caseId: props.caseId,
          caseType: props.caseType,
        },
      }
    );

    console.log(response.data.message);

    showAlert("已取消追蹤", "info");
    emit("followUpdated"); // ✅ 取消追蹤後，通知父組件刷新
    
  } catch (error) {
    console.error("追蹤請求失敗:", error);
    alert("追蹤失敗，請稍後再試！");
  }
};
</script>

<style scoped>
.follow-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out; /* ✅ 平滑過渡 */
}

/* ✅ 滑鼠懸停時發光 + 變色 */
.follow-button:hover {
  color: #8f7d7d;
  transform: scale(1.05); /* ✅ 輕微放大 */
}

/* ✅ 讓 Font Awesome 圖示在懸浮時發光 */
.follow-button:hover .heart-icon {
  text-shadow: 0 0 10px rgba(238, 188, 188, 0.9); /* ✅ 發光 */
  transform: scale(1.2); /* ✅ 圖示微微變大 */
}

.heart-icon {
  margin-right: 3px;
  font-size: 20px;
}

.custom-swal-popup {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
