<template>
  <div class="progress-detail">
    <div class="progress-header">
      <span class="create-time">{{ formatDate(createTime) }}</span>
      <span class="edit-button">修改</span>
    </div>
    <div class="progress-body">
      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt="進度圖片"
        class="progress-image"
      />
      <p class="progress-text">{{ progressDetail }}</p>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const rescueProgressList = ref([]);

// 接收父組件的 props
const props = defineProps({
  progressDetail: String,
  createTime: String,
  imageUrl: String,
});

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleString("zh-TW", options);
};
</script>

<style scoped>
.progress-detail {
  margin-left: 30px;
  border-left: #e7e7e7 solid 2px;
  padding: 0px 20px 40px 35px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.create-time {
  font-size: 14px;
  color: #252525;
  background-color: #f7d685;
  border-radius: 5px;
  padding: 5px 10px;
  position: relative; /* 讓偽元素相對於這個元素定位 */
}

/* 利用::before 來製作時間旁邊延伸出的橫線，形成一個時間軸的視覺效果*/
.create-time::before {
  content: ""; /* 讓它成為一條線 */
  position: absolute;
  top: 50%;
  left: -40px; /* 控制線的長度，調整這個值來讓線延伸到左側 */
  width: 40px; /* 設定線的寬度 */
  height: 2px; /* 設定線的高度 */
  background-color: #e7e7e7; /* 設定線的顏色 */
}

/* 時間軸上的原點 */
.create-time::after {
  content: "";
  position: absolute;
  top: 50%;
  left: -42px; /* 控制圓點位置，使其貼近左側時間軸 */
  width: 13px; /* 圓點大小 */
  height: 13px;
  background-color: #ffffff; /* 與時間標籤顏色一致 */
  border: 2px solid #f7d685; /* 圓點的邊框，讓它更清晰 */
  border-radius: 50%; /* 讓它變成圓形 */
  transform: translateY(-50%); /* 垂直置中 */
}

.edit-button {
  color: #007bff;
  cursor: pointer;
}

.progress-body {
  display: flex;
  gap: 20px;
}

.progress-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

.progress-text {
  margin-left: 25px;
  font-size: 16px;
  color: #333;
}
</style>
