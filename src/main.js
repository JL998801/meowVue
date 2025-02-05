import { createApp } from 'vue';
import App from './App.vue';
import route from './router/routers';
import { createPinia } from 'pinia';
import { store } from './stores/cart';  // 確保 Vuex store 正確引入
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@/plugins/fontawesome.js';

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

const pinia = createPinia();
app.use(pinia);
app.use(store);
app.use(route);
app.mount('#app');
