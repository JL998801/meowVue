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
<<<<<<< HEAD:vue-project/src/main.js
    .mount('#app')
=======
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
>>>>>>> 683414455919d46f5fa0828d9c3d6d258ab97f92:src/main.js
