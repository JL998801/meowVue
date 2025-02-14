<template>
    <div class="main-content">
        <!-- 🔥 這裡是你的主要內容 -->
        <slot></slot>
    </div>

    <footer class="site-footer">
        <div class="footer-container">
            <p class="footer-description"> 溫暖每個需要幫助的毛孩之家 </p>
            
            <div class="footer-links">
                <a href="/about" class="footer-link">關於我們</a>/
                <a href="/contact" class="footer-link">聯絡我們</a>/
                <a href="/privacy" class="footer-link">隱私政策</a>/
                <a href="/terms" class="footer-link">使用條款</a>
            </div>

            <div class="footer-social">
                <font-awesome-icon :icon="['fab', 'facebook']" class="social-icon" />
                <font-awesome-icon :icon="['fab', 'instagram']" class="social-icon"/>
                <font-awesome-icon :icon="['fab', 'twitter']" class="social-icon" />
            </div>

            <p class="footer-bottom">© 2024 壁爐之家. All rights reserved.</p>
        </div>
    </footer>
</template>


<style scoped>
/* 🚀 確保頁面高度填滿畫面，讓 footer 保持底部 */
html, body {
    height: 100%;
    margin: 0;
    padding: 0;
}

/* 📌 讓內容區塊填滿視窗，確保 footer 黏底 */
.main-content {
    display: flex;
    flex-direction: column;
    min-height: 50vh; /* 🔥 減去 header + footer 的高度 */
    flex: 1; /* 讓內容填滿 */
}

/* 🚀 讓 footer 固定於頁面底部 */
.site-footer {
    background: #C6BC77;
    color: white;
    text-align: center;
    font-size: 14px;
    position: relative; /* 確保 footer 依附內容 */
    bottom: 0;
    width: 100%;
    padding: 10px 10px;
}

/* 📢 Footer 主要內容 */
.footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 5px;
    background-color: #C6BC77;
    color: white;
    min-height: 50px; /* 控制 Footer 高度 */
}

/* 📝 文字說明 */
.footer-description {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 5px;
}

/* 🔗 連結區（水平排列 & 自適應換行） */
.footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    margin-bottom: 5px;
}

/* 🎨 連結樣式 */
.footer-link {
    color: #FFFD77;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s;
}

.footer-link:hover {
    color: #FEBA07;
}

/* 📢 社交媒體圖示 */
.footer-social {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 5px;
}

/* 🎨 圖示樣式 */
.social-icon {
    color: white;
    font-size: 18px;
    transition: color 0.3s;
}

.social-icon:hover {
    color: #FEBA07;
}

/* 🏛️ 版權聲明 */
.footer-bottom {
    font-size: 13px;
    opacity: 0.8;
}
</style>


