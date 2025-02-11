import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createApp } from 'vue'
import App from './App.vue'
import routes from './router/routers.js'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import FontAwesomeIcon from './plugins/fontawesome.js'
import "@/assets/petmain.css"; //全局樣式表

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

createApp(App)
    .use(pinia)
    .use(routes)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
