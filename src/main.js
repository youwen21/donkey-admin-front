import './assets/main.css'
import './assets/admin-ui.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { permissionPlugInstance } from './plugins/permission.js'

const app = createApp(App)

app.use(router)
app.use(permissionPlugInstance)
app.mount('#app')
