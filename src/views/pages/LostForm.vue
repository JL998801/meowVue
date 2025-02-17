<template>
    <div class="lost-case-form">
        <h2>遺失通報表單</h2>
        <form @submit.prevent="submitForm">

            <!-- 案件標題 -->
            <div class="form-group">
                <label for="caseTitle">*案件標題：</label>
                <input v-model="form.caseTitle" type="text" id="caseTitle" placeholder="請輸入案件標題" required>
            </div>

            <!-- 動物種類 -->
            <div class="form-group">
                <label>*動物種類：</label>
                <div class="radio-group">
                    <label>
                        <input type="radio" v-model="form.species" value="1" required>
                        狗
                    </label>
                    <label>
                        <input type="radio" v-model="form.species" value="2">
                        貓
                    </label>
                </div>
            </div>

            <!-- 遺失地點 -->
            <div class="form-group">
                <label for="city">*縣市：</label>
                <div class="form-row">
                    <select v-model="form.city" id="city" required>
                        <option value="台北市">台北市</option>
                        <option value="新北市">新北市</option>
                        <option value="台中市">台中市</option>
                    </select>
                </div>
                <label for="city">*鄉鎮區：</label>
                <div class="form-row">
                    <select v-model="form.district" id="district" required>
                        <option value="大安區">大安區</option>
                        <option value="信義區">信義區</option>
                        <option value="中正區">中正區</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>街道地址（選填）：</label>
                <input v-model="form.street" type="text" placeholder="輸入街道地址">
            </div>
            <div class="form-group">
                <label>附近地標（選填）：</label>
                <input v-model="form.landmark" type="text" placeholder="輸入附近地標">
            </div>

            <!-- 動物基本資訊 -->
            <div class="form-group">
                <label for="name">*寵物姓名：</label>
                <input v-model="form.name" type="text" id="name" required>
            </div>

            <div class="form-group">
                <label for="gender">*寵物性別：</label>
                <select v-model="form.gender" id="gender" required>
                    <option value="公">公</option>
                    <option value="母">母</option>
                </select>
            </div>

            <div class="form-group">
                <label for="sterilization">*絕育狀態：</label>
                <select v-model="form.sterilization" id="sterilization" required>
                    <option value="是">是</option>
                    <option value="否">否</option>
                </select>
            </div>

            <div class="form-group">
                <label for="microchip">*晶片：</label>
                <select v-model="form.microchip" id="microchip" required>
                    <option value="有">有</option>
                    <option value="無">無</option>
                </select>
            </div>

            <!-- 特徵描述 -->
            <div class="form-group">
                <label for="breed">*品種：</label>
                <select v-model="form.breed" id="breed" required>
                    <option value="柴犬">柴犬</option>
                    <option value="柯基">柯基</option>
                    <option value="拉布拉多">拉布拉多</option>
                    <option value="其他">其他</option>
                </select>
            </div>

            <div class="form-group">
                <label for="furColor">*毛色：</label>
                <select v-model="form.furColor" id="furColor" required>
                    <option value="黑色">黑色</option>
                    <option value="白色">白色</option>
                    <option value="棕色">棕色</option>
                    <option value="灰色">灰色</option>
                    <option value="其他">其他</option>
                </select>
            </div>

            <div class="form-group">
                <label for="featureDescription">補充說明：</label>
                <textarea v-model="form.featureDescription" id="featureDescription" rows="3"></textarea>
            </div>

            <!-- 遺失經過 -->
            <div class="form-group">
                <label for="lostExperience">*遺失經過：</label>
                <textarea v-model="form.lostExperience" id="lostExperience" rows="3" required></textarea>
            </div>

            <!-- 聯絡方式 -->
            <div class="form-group">
                <label>聯絡方式：</label>
                <input v-model="form.contact" type="text" placeholder="輸入聯絡方式">
            </div>

            <!-- 圖片上傳 -->
            <div class="form-group">
                <label>*寵物照片（最多 3 張）：</label>
                <div class="image-preview">
                    <div v-for="(image, index) in previewImages" :key="index" class="image-box">
                        <img :src="image" alt="上傳圖片">
                        <button type="button" @click="removeImage(index)">移除</button>
                    </div>
                </div>
                <input type="file" @change="handleFileUpload" multiple accept="image/*">
            </div>

            <!-- 送出按鈕 -->
            <button type="submit" class="submit-btn">確定送出</button>

        </form>
    </div>
</template>

<script setup>

</script>

<style></style>