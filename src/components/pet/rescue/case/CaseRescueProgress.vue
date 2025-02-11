<template lang="">
  <div class="progress-content"> 
    <div class="title-container">
      <font-awesome-icon icon="fa-solid fa-paw"  class="paw-icon" /><h3>進度更新</h3> 
    </div>
    
</div> 
</template>
<script setup>

</script>
<style scoped>
h3 {
  font-size: 20px;
  font-weight: 500;
  margin-left: 10px; /* 確保圖示與文字之間有間距 */
}

p {
  font-size: 16px;
  margin-top: 30px;
}

.progress-content{
  margin-top: 30px;
}

.rescue-content p {
  margin-left: 30px;
}

.title-container {
  display: flex;
  align-items: center; /* 讓圖示和文字垂直居中對齊 */
}

.paw-icon {
  font-size: 20px; /* 調整圖示大小 */
  color: #f7d685; /* 設置顏色，可依需求更改 */
}

</style>
