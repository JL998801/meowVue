import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { store } from './stores/cart';  // 確保 Vuex store 正確引入

// 引入 FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faShoppingCart,faPaw, faMapLocationDot, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// 將圖標加入 FontAwesome 圖庫
library.add(faUser, faShoppingCart,faPaw,faMapLocationDot,faMagnifyingGlass );

const app = createApp(App);

// 註冊 FontAwesome 組件
app.component('font-awesome-icon', FontAwesomeIcon);

// 註冊 Pinia
const pinia = createPinia();
app.use(pinia);

// 註冊 Vuex store（如果有使用）
app.use(store);

// 註冊 Vue Router
app.use(router);

// 掛載應用至 #app
app.mount('#app');
