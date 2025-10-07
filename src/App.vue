<script setup>
// imports
import { ref, onMounted } from 'vue'
import { useFavoritesStore } from './stores/useFavoritesStore'
import { useThemeStore } from './stores/useThemeStore'
import { supabase } from './lib/supabaseClient'
import FavoritesList from './components/FavoritesList.vue'
import AuthForm from './components/AuthForm.vue'
import { RouterView, useRoute } from 'vue-router'

// stores
const favStore = useFavoritesStore()
const themeStore = useThemeStore()
const user = ref(null)
const route = useRoute()

onMounted(async () => {
  favStore.init()

  const { data } = await supabase.auth.getUser()
  user.value = data.user

  // connexion/déconnexion
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })

  themeStore.applyTheme()
})

const signOut = async () => {
  await supabase.auth.signOut()
}
</script>

<template>
  <main>
    <header class="header">
      <h1>TP : Pokédex en Vue.js</h1>
    </header>

    <div v-if="!user">
      <AuthForm />
    </div>

    <div v-else class="lists">
      <p>Connecté en tant que : {{ user.email }}</p>
      <div>
        <button v-on:click="signOut">Se déconnecter</button>
        <button class="theme-toggle" v-on:click="themeStore.toggleTheme">
          {{ themeStore.isDark ? 'Light mode' : 'Dark mode' }}
        </button>
      </div>

      <FavoritesList v-if="route.path === '/'" />

      <RouterView />
    </div>
  </main>
</template>

<style>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

button {
  background: #212121;
  border: 2px solid #212121;
  color: #fff;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;
}

button:hover {
  background: #444444;
  color: #fff;
}

.lists {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.theme-toggle {
  background: #212121;
  border: 2px solid #212121;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;
  margin-left: 1rem;
}

.theme-toggle:hover {
  background: #444444;
  color: #fff;
}
</style>
