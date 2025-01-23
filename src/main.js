import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { store } from './store/cart';  // 確保 Vuex store 正確引入

const app = createApp(App);

// 註冊 Pinia
const pinia = createPinia();
app.use(pinia);

// 註冊 Vuex store（如果有使用）
app.use(store);

// 註冊 Vue Router
app.use(router);

// 掛載應用至 #app
app.mount('#app');
