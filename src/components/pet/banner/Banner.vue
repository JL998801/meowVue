<template>
  <div class="carousel-container">
    <div
      v-for="category in caseCategories"
      :key="category.type"
      class="carousel-section"
    >
      <div class="carousel-header">
        <div class="title-container">
          <h3>🐾 {{ category.title }}</h3>
        </div>
        <router-link :to="category.moreLink" class="more-button"
          >查看更多</router-link
        >
      </div>

      <div class="carousel-wrapper">
        <button @click="prevSlide(category.type)" class="nav-button">‹</button>
        <div class="carousel">
          <template
            v-if="
              displayedCases[category.type] &&
              displayedCases[category.type].length > 0
            "
          >
            <div
              v-for="caseItem in displayedCases[category.type]"
              :key="caseItem.bannerId"
              class="carousel-item"
              @click="goToCaseDetail(caseItem)"
              style="cursor: pointer"
            >
              <img
                :src="
                  caseItem.imageUrl ? caseItem.imageUrl : '/images/default.png'
                "
                alt="案件圖片"
                class="case-image"
              />
              <p class="case-title">{{ caseItem.caseTitle || "未知標題" }}</p>
            </div>
          </template>
          <p v-else class="no-data-message">目前沒有相關案件</p>
        </div>
        <button @click="nextSlide(category.type)" class="nav-button">›</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { axiosapi } from "@/plugins/axios.js";

// **案件分類**
const caseCategories = ref([
  { title: "流浪救援", type: "RESCUE", moreLink: "/rescue" },
  { title: "遺失協尋", type: "LOST", moreLink: "/lost" },
  { title: "動物認養", type: "ADOPT", moreLink: "/adopt" },
]);

// **存儲所有案件**
const cases = ref({
  RESCUE: [],
  LOST: [],
  ADOPT: [],
});

// **當前顯示的 5 個最新案件**
const displayedCases = ref({
  RESCUE: [],
  LOST: [],
  ADOPT: [],
});

// **獲取 Banner 資料**
const fetchBannerData = async () => {
  try {
    const response = await axiosapi.get(`/banners`);
    let banners = response.data;

    console.log("✅ 獲取的 banners:", banners);

    // 過濾掉 `isHidden: true` 的 Banner
    banners = banners.filter((banner) => !banner.isHidden);

    // 按 `onlineDate` 降冪排序
    banners.sort((a, b) => new Date(b.onlineDate) - new Date(a.onlineDate));

    // 轉換資料格式，確保 `imageUrl` 存在
    const processBanner = (banner) => ({
      bannerId: banner.bannerId, // ✅ `bannerId` 作為唯一標識
      caseTitle: banner.caseTitle || "未知標題",
      imageUrl: banner.pictureUrl || "/images/default.png", // ✅ 確保圖片可用
      type: banner.bannerType,
      lostCaseId: banner.lostCaseId || null,
      rescueCaseId: banner.rescueCaseId || null,
      adoptionCaseId: banner.adoptionCaseId || null,
    });

    // **分類案件**
    cases.value.LOST = banners
      .filter((b) => b.bannerType === "LOST")
      .map(processBanner);
    cases.value.RESCUE = banners
      .filter((b) => b.bannerType === "RESCUE")
      .map(processBanner);
    cases.value.ADOPT = banners
      .filter((b) => b.bannerType === "ADOPT")
      .map(processBanner);

    // **只顯示最新的 5 筆案件**
    displayedCases.value.LOST = [...cases.value.LOST.slice(0, 5)];
    displayedCases.value.RESCUE = [...cases.value.RESCUE.slice(0, 5)];
    displayedCases.value.ADOPT = [...cases.value.ADOPT.slice(0, 5)];

    console.log("🔍 最新案件:", displayedCases.value);
  } catch (error) {
    console.error("❌ 獲取 Banner 資料失敗:", error);
  }
};

// **點擊 Banner，導向對應的案件詳情頁**
const goToCaseDetail = (banner) => {
  if (!banner) {
    console.warn("⚠️ Banner 數據為空，無法跳轉");
    return;
  }

  let targetUrl = "";

  if (banner.type === "LOST") {
    if (banner.lostCaseId) {
      targetUrl = `/pet/lostCase/${banner.lostCaseId}`;
    } else {
      alert("⚠️ 這則遺失協尋沒有對應的案件 ID");
      return;
    }
  } else if (banner.type === "RESCUE") {
    if (banner.rescueCaseId) {
      targetUrl = `/pet/rescueCase/${banner.rescueCaseId}`;
    } else {
      alert("⚠️ 這則流浪救援沒有對應的案件 ID");
      return;
    }
  } else if (banner.type === "ADOPT") {
    if (banner.adoptionCaseId) {
      targetUrl = `/pet/adoptCase/${banner.adoptionCaseId}`;
    } else {
      alert("⚠️ 這則動物認養沒有對應的案件 ID");
      return;
    }
  } else {
    console.warn("⚠️ 無對應的案件類型", banner);
    return;
  }

  window.location.href = targetUrl;
};

// **自動輪播**
const startAutoSlide = () => {
  setInterval(() => {
    caseCategories.value.forEach((category) => {
      nextSlide(category.type);
    });
  }, 3000);
};

// **下一組**
const nextSlide = (type) => {
  if (displayedCases.value[type] && displayedCases.value[type].length > 1) {
    let temp = displayedCases.value[type].shift(); // 取出第一個元素
    displayedCases.value[type].push(temp); // 放到最後
  }
};

// **上一組**
const prevSlide = (type) => {
  if (displayedCases.value[type] && displayedCases.value[type].length > 1) {
    let temp = displayedCases.value[type].pop(); // 取出最後一個元素
    displayedCases.value[type].unshift(temp); // 放到最前面
  }
};

// **頁面載入時執行**
onMounted(async () => {
  console.log("⏩ 自動輪播觸發");
  await fetchBannerData(); // ✅ 獲取最新案件
  startAutoSlide(); // ✅ 開啟自動輪播
});
</script>

<style scoped>
/* 設置輪播器最大寬度以及內容寬度 */
.carousel-container {
  max-width: 1250px;
  margin: auto;
  padding: 20px;
}

/* 每個類別段落的格式 */
.carousel-section {
  margin-bottom: 20px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  opacity: 0.95; /* 設置透明度 */
}

/* 標題和按鈕欄 */
.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #feba07;
}

/* 標題分組 */
.title-container {
  display: flex;
  align-items: center;
}

/* 類別圖標格式 */
.section-icon {
  color: #c6bc77;
  margin-right: 8px;
}

/* 查看更多按鈕 */
.more-button {
  background-color: #c6bc77;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 14px;
}

/* 輪播系統的對齊格式 */
.carousel-wrapper {
  position: relative;
  overflow: hidden; /* 如果有滾動條影響，可以嘗試 auto */
  width: 100%;
  padding: 0 20px;
}

/* 內部輪播區域 */
.carousel {
  display: flex;
  position: relative; /* 讓內部的 .nav-button 可以定位 */
  flex-wrap: nowrap; /* 保持橫向排列 */
  overflow-x: hidden; /* 允許水平滾動 */
  gap: 10px; /* 控制每個項目之間的間距 */
  scroll-behavior: smooth;
  padding: 10px 0; /* 縮小垂直間距 */
  align-items: center;
  /* 讓所有項目垂直居中 */
  justify-content: space-around;
  width: 100%;
}

/* 每個案件卡片格式 */
.carousel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 18px;
  /* 設定固定寬度 */
  min-width: 180px;
  /* 確保不會縮小 */
  height: 250px;
  text-align: center;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin: 0;
  flex: 0 0 auto;
  /* 讓每個 item 佔據適當的寬度 */
}

/* 案件圖片格式 */
.case-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 5px;
}

/* 案件標題文字格式 */
.case-title {
  font-size: 14px;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 輪播器左右按鈕 */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  color: white;
  border: none;
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
  z-index: 10; /* 確保按鈕在最上層 */
}

.nav-button:first-child {
  left: 10px; /* 左側按鈕 */
}

.nav-button:last-child {
  right: 10px; /* 右側按鈕 */
}
</style>
