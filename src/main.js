import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from './router'

import App from './App.vue'
import { useFavoritesStore } from './stores/useFavoritesStore'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
const favStore = useFavoritesStore()
favStore.init()

app.mount('#app')
