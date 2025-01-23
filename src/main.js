import { createApp } from 'vue';
import App from './shopApp.vue';
import router from './router';
import { store } from './store/cart';  // 確保 Vuex store 正確引入

// 建立 Vue 應用
const app = createApp(App);

// 註冊 Vue Router
app.use(router);

// 註冊 Vuex store（如果有使用）
app.use(store);

// 掛載應用至 #app
app.mount('#app');
