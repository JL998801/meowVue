<template>
    <div class="carousel">
      <font-awesome-icon icon="angle-left" class="arrow" @click="scrollLeft" />
      
      <!-- 🔹 這裡使用 slot 讓 shopHome 注入內容 -->
      <div class="carousel-container" ref="slider">
        <slot></slot>
      </div>
  
      <font-awesome-icon icon="angle-right" class="arrow" @click="scrollRight" />
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const slider = ref(null);
  
  const scrollLeft = () => {
    if (slider.value) {
      slider.value.scrollLeft -= 250;
      if (slider.value.scrollLeft <= 0) {
        slider.value.scrollLeft = slider.value.scrollWidth;
      }
    }
  };
  
  const scrollRight = () => {
    if (slider.value) {
      slider.value.scrollLeft += 250;
      if (slider.value.scrollLeft >= slider.value.scrollWidth - slider.value.clientWidth) {
        slider.value.scrollLeft = 0;
      }
    }
  };
  </script>
  
  <style scoped>
  .carousel {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .carousel-container {
    display: flex;
    overflow-x: scroll;
    scroll-behavior: smooth;
    white-space: nowrap;
    width: 100%;
    max-width: 800px;
  }
  
  .arrow {
    cursor: pointer;
    font-size: 24px;
    user-select: none;
  }
  </style>
  