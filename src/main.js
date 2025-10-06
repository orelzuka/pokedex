import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { useFavoritesStore } from './stores/useFavoritesStore'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const favStore = useFavoritesStore()
favStore.init()

app.mount('#app')
