<template>
  <div class="case-stats">
    <h2>案件數據分析</h2>

    <!-- 刷新數據按鈕 -->
    <button
      @click="
        fetchStats();
        updateViewChartTop();
      "
      class="btn-refresh"
    >
      刷新數據
    </button>

    <div class="charts">
      <!-- 🔹 案件瀏覽人次分析 -->
      <div class="chart-container">
        <h3>救援案件瀏覽人次分析</h3>
        <div class="chart-controls">
          <button @click="updateViewChartTop">前 10 名</button>
          <button @click="updateViewChartBottom">後 10 名</button>
        </div>
        <canvas ref="viewChart"></canvas>
      </div>

      <!-- 案件趨勢圖表 -->
      <div class="chart-container">
        <h3>單一案件瀏覽趨勢</h3>
        <input v-model="singleCaseId" placeholder="輸入案件 ID" type="number" />
        <button @click="fetchCaseTrend">查詢</button>
        <canvas ref="trendChart"></canvas>
      </div>

      <!-- 🔹 案件追蹤人次分析 -->
      <div class="chart-container">
        <h3>案件追蹤人次分析</h3>
        <div class="chart-controls">
          <button @click="updateFollowChart('top')">前 10 名</button>
          <button @click="updateFollowChart('bottom')">後 10 名</button>
        </div>
        <canvas ref="followChart"></canvas>
      </div>

      <!-- 各縣市案件數量 -->
      <div class="chart-container">
        <h3>各縣市案件數量</h3>
        <canvas ref="cityChart"></canvas>
      </div>

      <!-- 狗 vs 貓 案件數 -->
      <div class="chart-container">
        <h3>狗 vs 貓 案件比例</h3>
        <canvas ref="speciesChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { axiosapi2 } from "@/plugins/axios.js";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels"; // 引入 datalabels 插件標示數據

Chart.register(ChartDataLabels); //註冊 datalabels 插件

//瀏覽圖表
const viewChart = ref(null); //圖表實例，展現於前端上
let viewChartInstance = null;
const caseList = ref([]); //後端返回的數據(前10後10)
//單一案件瀏覽人次表
const trendChart = ref(null);
let trendChartInstance = null;
const singleCaseId = ref("");
const caseTrendData = ref([]);
//追蹤圖表
const followChart = ref(null);
let followChartInstance = null;
const followChartData = ref("top"); // 控制案件追蹤人次的篩選
//物種圖表
const statsData = ref(null);
const speciesChart = ref(null);
let speciesChartInstance = null;
//縣市圖表
let cityChartInstance = null;
const cityChart = ref(null);

// **取得統計數據**
const fetchStats = async () => {
  try {
    const response = await axiosapi2.get(`/RescueCase/analysis`);
    statsData.value = response.data;

    // **等待 DOM 更新後再渲染圖表**
    await nextTick();
    renderCharts();
  } catch (error) {
    console.error("獲取案件統計數據失敗:", error);
  }
};

// **清除舊圖表，避免重複繪製**
const clearChart = (chartInstance) => {
  if (chartInstance) {
    chartInstance.destroy();
  }
};

// **取得前 10 名案件**
const updateViewChartTop = async () => {
  try {
    const response = await axiosapi2.get(`/caseView/top/rescue`);
    caseList.value = [...response.data]; // ✅ 確保 caseList.value 被正確更新
    console.log("前10名案件:", caseList.value);
    await nextTick();
    renderViewChart();
  } catch (error) {
    console.error("獲取前 10 名案件失敗:", error);
  }
};

// **取得後 10 名案件**
const updateViewChartBottom = async () => {
  try {
    const response = await axiosapi2.get(`/caseView/bottom/rescue`);
    caseList.value = response.data;
    await nextTick();
    renderViewChart();
  } catch (error) {
    console.error("獲取後 10 名案件失敗:", error);
  }
};

// ✅ **更新案件瀏覽數的圖表**
const updateViewChart = (type) => {
  viewChartData.value = type;
  renderViewChart();
};

// ✅ **更新案件追蹤人次的圖表**
const updateFollowChart = (type) => {
  followChartData.value = type;
  renderFollowChart();
};

// **繪製圖表**
const renderCharts = () => {
  if (!statsData.value) return;

  // 先清除舊圖表
  clearChart(viewChartInstance);
  clearChart(followChartInstance);
  clearChart(cityChartInstance);
  clearChart(speciesChartInstance);

  renderViewChart(); // 更新案件瀏覽數的圖表(方法寫於外面)
  renderFollowChart(); // 更新案件追蹤數的圖表
  renderTrendChart();

  // 各縣市案件數量（圓餅圖）
  cityChartInstance = new Chart(cityChart.value, {
    type: "pie",
    data: {
      labels: statsData.value.caseByCity.map((c) => c.city),
      datasets: [
        {
          data: statsData.value.caseByCity.map((c) => c.count),
          backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 20, // ✅ 調整圖例的字體大小
            },
          },
        },
        datalabels: {
          color: "#fff", // 標籤顏色
          font: { weight: "bold", size: 14 }, // 字體大小
          formatter: (value) => `${value} 件`, // ✅ 在圓餅圖上顯示數據
        },
      },
    },
  });

  // 狗 vs 貓 案件數量（圓餅圖）
  speciesChartInstance = new Chart(speciesChart.value, {
    type: "pie",
    data: {
      labels: ["狗", "貓"],
      datasets: [
        {
          data: [
            statsData.value.speciesCount.dog,
            statsData.value.speciesCount.cat,
          ],
          backgroundColor: ["#ffa500", "#800080"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 20, // ✅ 調整圖例的字體大小
            },
          },
        },
        datalabels: {
          color: "#fff", // 標籤顏色
          font: { weight: "bold", size: 14 }, // 字體大小
          formatter: (value) => `${value} 件`, // ✅ 在圓餅圖上顯示數據
        },
      },
    },
  });
};

// **繪製案件瀏覽人次圖表**
const renderViewChart = () => {
  // ✅ 確保舊圖表實例被銷毀
  if (viewChartInstance) {
    viewChartInstance.destroy();
    viewChartInstance = null; // 確保變數被重置
  }

  // ✅ 使用 `caseList.value.map()` 正確取數據
  viewChartInstance = new Chart(viewChart.value, {
    type: "bar",
    data: {
      labels: caseList.value.map((c) => c.caseId), // ✅ 確保使用標題作為 x 軸
      datasets: [
        {
          label: "瀏覽人次",
          data: caseList.value.map((c) => c.viewCount),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 20, // ✅ 調整圖例的字體大小
            },
          },
        },
        tooltip: {
          titleFont: {
            size: 18, // ✅ 提示框標題字體
          },
          bodyFont: {
            size: 18, // ✅ 提示框內容字體
          },
          callbacks: {
            label: function (tooltipItem) {
              const caseIndex = tooltipItem.dataIndex;
              return `${caseList.value[caseIndex].caseTitle}: ${caseList.value[caseIndex].viewCount} 次瀏覽`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "案件ID",
            font: {
              size: 18, // ✅ X 軸標題字體
              weight: "bold",
            },
          },
          ticks: {
            font: {
              size: 18, // ✅ X 軸數據標籤字體
            },
            // maxRotation: 45, // 避免標題擠在一起
            // minRotation: 45,
          },
        },
        y: {
          title: {
            display: true,
            text: "瀏覽人次",
            font: {
              size: 18, // ✅ Y 軸標題字體
              weight: "bold",
            },
          },
          ticks: {
            font: {
              size: 18, // ✅ Y 軸數據標籤字體
            },
            stepSize: 1, // ✅ 讓 Y 軸只顯示整數
            beginAtZero: true, // 從 0 開始
            callback: function (value) {
              return Number.isInteger(value) ? value : ""; // 確保只顯示整數
            },
          },
        },
      },
    },
  });
};

// **繪製「案件追蹤人次」圖表**
const renderFollowChart = () => {
  clearChart(followChartInstance);

  let caseList =
    followChartData.value === "top"
      ? statsData.value.topCases
      : statsData.value.bottomCases;

  followChartInstance = new Chart(followChart.value, {
    type: "bar",
    data: {
      labels: caseList.map((c) => c.rescueCaseId),
      datasets: [
        {
          label: "追蹤人次",
          data: caseList.map((c) => c.follow),
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 20, // **調整圖例的字體大小**
            },
          },
        },
        tooltip: {
          titleFont: {
            size: 18, // **提示框標題字體**
          },
          bodyFont: {
            size: 18, // **提示框內容字體**
          },
        },
      },
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "案件 ID" },
        },
        y: {
          title: { display: true, text: "追蹤人次" },
          ticks: {
            stepSize: 1, // ✅ 讓 Y 軸只顯示整數
            beginAtZero: true, // 從 0 開始
            callback: function (value) {
              return Number.isInteger(value) ? value : ""; // 確保只顯示整數
            },
          },
        },
      },
    },
  });
};

// **獲取單一案件瀏覽趨勢**
const fetchCaseTrend = async () => {
  if (!singleCaseId.value) {
    alert("請輸入案件 ID");
    return;
  }

  try {
    const response = await axiosapi2.get(
      `/caseView/trend/rescue/${singleCaseId.value}`
    );
    caseTrendData.value = response.data;
    console.log("案件瀏覽", caseTrendData.value);
    await nextTick();
    renderTrendChart();
  } catch (error) {
    console.error("獲取案件趨勢數據失敗:", error);
  }
};

// **繪製案件趨勢折線圖**
const renderTrendChart = () => {
  if (trendChartInstance) {
    trendChartInstance.destroy();
  }

  trendChartInstance = new Chart(trendChart.value, {
    type: "line",
    data: {
      labels: caseTrendData.value.map((d) => d.viewDate), // **修改這裡，顯示日期**
      datasets: [
        {
          label: "瀏覽人次",
          data: caseTrendData.value.map((d) => d.viewCount),
          borderColor: "#007bff",
          backgroundColor: "rgba(0, 123, 255, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            font: {
              size: 20, // **調整圖例的字體大小**
            },
          },
        },
        tooltip: {
          titleFont: {
            size: 18, // **提示框標題字體**
          },
          bodyFont: {
            size: 18, // **提示框內容字體**
          },
        },
      },
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "日期" },
          ticks: { autoSkip: true, maxTicksLimit: 10 }, // **避免過多的時間點**
        },
        y: {
          title: { display: true, text: "瀏覽人次" },
          ticks: {
            stepSize: 1, //讓 Y 軸每次增加 1，確保不會有小數點。
            beginAtZero: true, // 讓 Y 軸從 0 開始
            callback: function (value) {
              return Number.isInteger(value) ? value : ""; // 這個函數確保 只有整數 會顯示在 Y 軸，小數點值不會顯示
            },
          },
        },
      },
    },
  });
};

// **載入數據**
onMounted(() => {
  fetchStats();
  updateViewChartTop();
});
</script>

<style scoped>
.case-stats {
  padding: 20px;
}

.btn-refresh {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;
}

.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  height: 80%;
}

/* .chart-container {
  flex: 1 1 calc(50% - 20px);
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
 
} */

.chart-container {
  margin: 20px auto;
  width: 80%;
  text-align: center;
}

input {
  margin-right: 10px;
  padding: 5px;
}

button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
