import { createApp } from 'vue'
import App from './App.vue'
import routes from './router/routers.js'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import FontAwesomeIcon from './plugins/fontawesome.js'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)

createApp(App)
    .use(pinia)
    .use(routes)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')