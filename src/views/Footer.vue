<template>
    <footer class="site-footer">
        <div class="footer-container">
            <div class="footer-left">
            <p class="footer-description">溫暖每個需要幫助的毛孩之家</p>
            </div>
    
            <div class="footer-links">
            <router-link to="/about" class="footer-link">關於我們</router-link>/
            <router-link to="/contact" class="footer-link">聯絡我們</router-link>/
            <router-link to="/privacy" class="footer-link">隱私政策</router-link>/
            <router-link to="/terms" class="footer-link">使用條款</router-link>
            </div>
    
            <div class="footer-social">
            <a href="https://www.facebook.com" target="_blank" class="social-icon">
                <font-awesome-icon :icon="['fab', 'facebook']" />
            </a>
            <a href="https://www.instagram.com" target="_blank" class="social-icon">
                <font-awesome-icon :icon="['fab', 'instagram']" />
            </a>
            <a href="https://www.twitter.com" target="_blank" class="social-icon">
                <font-awesome-icon :icon="['fab', 'twitter']" />
            </a>
            </div>
        </div>
    
        <div class="footer-bottom">
            <p>© 2024 壁爐之家. All rights reserved.</p>
        </div>
    </footer>
</template>

<style scoped>
/* 整個頁尾 */
.site-footer {
    background: #C6BC77;
    color: white;
    padding: 30px 20px;
    text-align: center;
    font-size: 14px;
}

/* 主要內容區 */
.footer-container {
    align-items: center; /* 垂直置中 */
    justify-content: center; /* 內容置中 */
    padding: 20px;
    background-color: #C6BC77; /* 頁腳背景顏色 */
    color: white; /* 文字顏色 */
    padding: 10px 0;; /* 上下縮小間距 */
    min-height: 80px; /* 降低 Footer 的高度 */
}

.footer-description {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
}

/* 頁腳連結 */
.footer-links {
    display: flex;
    align-items: center; /* 垂直置中 */
    justify-content: center; /* 內容置中 */
    gap: 15px;
}

.footer-link {
    color: #FFFD77;
    text-decoration: none;
    font-size: 14px;
    transition: 0.3s;
}

.footer-link:hover {
    color: #FEBA07;
}

/* 社交媒體圖示 */
.footer-social {
    display: flex;
    align-items: center; /* 垂直置中 */
    justify-content: center; /* 內容置中 */
    gap: 10px;
}

.social-icon {
    color: white;
    font-size: 18px;
    transition: 0.3s;
}

.social-icon:hover {
    color: #FEBA07;
}

/* 底部版權聲明 */
.footer-bottom {
    font-size: 15px;
    opacity: 0.8;
}
</style>
