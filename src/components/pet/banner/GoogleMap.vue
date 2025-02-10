<template>
    <div>
        <h3>浪浪地圖</h3>
        插入google地圖，連接資料庫取得案件廣告，根據地址與經緯度顯示在地圖上(小圖釘)。
        <ul>
            <li>遺失案件廣告(黃色小圖釘)</li>
            <li>救援案件廣告(紅色小圖釘)</li>
            <li>認養案件廣告(藍色小圖釘)</li>
        </ul>
        <div ref="mapContainer" class="map-container"></div>
    </div>
</template>

<script setup>
// import { ref, onMounted } from "vue";

// // Google Maps API Key（換成你的 API 金鑰）
// const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

// // 地圖容器
// const mapContainer = ref(null);
// let map = null;

// // 模擬後端資料
// const cases = ref([
//     { id: 1, type: "lost", lat: 25.033964, lng: 121.564472 }, // 遺失案件
//     { id: 2, type: "rescue", lat: 25.043964, lng: 121.554472 }, // 救援案件
//     { id: 3, type: "adopt", lat: 25.053964, lng: 121.544472 }, // 認養案件
// ]);

// // 圖釘顏色對應
// const markerIcons = {
//     lost: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
//     rescue: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
//     adopt: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
// };

// // 初始化 Google 地圖
// const initMap = () => {
//     if (!mapContainer.value) return;

//     // 創建地圖
//     map = new google.maps.Map(mapContainer.value, {
//         center: { lat: 25.033964, lng: 121.564472 }, // 台北 101 為預設中心點
//         zoom: 12,
//     });

//     // 加入案件圖釘
//     cases.value.forEach((caseData) => {
//         new google.maps.Marker({
//             position: { lat: caseData.lat, lng: caseData.lng },
//             map: map,
//             icon: markerIcons[caseData.type], // 根據案件類型顯示不同顏色的圖釘
//             title: `案件 ID: ${caseData.id}`,
//         });
//     });
// };

// // 載入 Google Maps API 並初始化地圖
// onMounted(() => {
//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
//     script.async = true;
//     script.defer = true;
//     window.initMap = initMap;
//     document.head.appendChild(script);
// });
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 500px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
