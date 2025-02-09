import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createApp } from 'vue';
import App from './App.vue';
import router from './router/routers';
import { createPinia } from 'pinia';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@/plugins/fontawesome.js';

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount('#app');
