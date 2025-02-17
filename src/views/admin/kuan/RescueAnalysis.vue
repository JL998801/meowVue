<template>
  <div class="case-stats">
    <h2>案件數據分析</h2>

    <!-- 刷新數據按鈕 -->
    <button @click="fetchStats" class="btn-refresh">刷新數據</button>

    <div class="charts">
      <!-- 🔹 案件瀏覽人次分析 -->
      <div class="chart-container">
        <h3>案件瀏覽人次分析</h3>
        <div class="chart-controls">
          <button @click="updateViewChart('top')">前 10 名</button>
          <button @click="updateViewChart('bottom')">後 10 名</button>
        </div>
        <canvas ref="viewChart"></canvas>
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

const statsData = ref(null);
const viewChart = ref(null);
const followChart = ref(null);
const cityChart = ref(null);
const speciesChart = ref(null);
let viewChartInstance = null;
let followChartInstance = null;
let cityChartInstance = null;
let speciesChartInstance = null;
const viewChartData = ref("top"); // 🔹 控制目前顯示的是瀏覽前10還是後10
const followChartData = ref("top"); // 🔹 控制案件追蹤人次的篩選

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

  // **清除舊圖表**
  clearChart(viewChartInstance);
  clearChart(followChartInstance);
  clearChart(cityChartInstance);
  clearChart(speciesChartInstance);

  renderViewChart(); // 更新案件瀏覽數的圖表
  renderFollowChart(); // 更新案件追蹤數的圖表

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
        datalabels: {
          color: "#fff", // 標籤顏色
          font: { weight: "bold", size: 14 }, // 字體大小
          formatter: (value) => `${value} 件`, // ✅ 在圓餅圖上顯示數據
        },
      },
    },
  });
};

// ✅ **繪製「案件瀏覽人次」圖表**
const renderViewChart = () => {
  clearChart(viewChartInstance);

  // 🔹 **決定顯示前10或後10**
  let caseList =
    viewChartData.value === "top"
      ? statsData.value.topCases
      : statsData.value.bottomCases;

  viewChartInstance = new Chart(viewChart.value, {
    type: "bar",
    data: {
      labels: caseList.map((c) => c.rescueCaseId),
      datasets: [
        {
          label: "瀏覽人次",
          data: caseList.map((c) => c.viewCount),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const caseIndex = tooltipItem.dataIndex;
              const caseTitle = caseList[caseIndex].caseTitle;
              const caseViewCount = caseList[caseIndex].viewCount;
              return `${caseTitle}: ${caseViewCount} 次瀏覽`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "案件 ID",
          },
        },
        y: {
          title: {
            display: true,
            text: "瀏覽人次",
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
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: "案件 ID" },
        },
        y: {
          title: { display: true, text: "追蹤人次" },
        },
      },
    },
  });
};

// **載入數據**
onMounted(fetchStats);
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

.chart-container {
  flex: 1 1 calc(50% - 20px);
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  height: 400px;
}
</style>
