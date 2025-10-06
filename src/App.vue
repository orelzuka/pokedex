<script setup>
// imports
import { ref, onMounted } from 'vue'
import { useFavoritesStore } from './stores/useFavoritesStore'
import { supabase } from './lib/supabaseClient'

// composants
import FavoritesList from './components/FavoritesList.vue'
import PokemonList from './components/PokemonList.vue'
import AuthForm from './components/AuthForm.vue'

// stores
const favStore = useFavoritesStore()
const user = ref(null)

onMounted(async () => {
  favStore.init()

  const { data } = await supabase.auth.getUser()
  user.value = data.user

  // connexion/deconnexion
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })
})

const signOut = async () => {
  await supabase.auth.signOut()
}
</script>

<template>
  <main>
    <h1>TP : Pokédex en Vue.js</h1>

    <div v-if="!user">
      <AuthForm />
    </div>

    <div v-else class="lists">
      <p>Connecté en tant que : {{ user.email }}</p>
      <button v-on:click="signOut">Se déconnecter</button>
      <!-- liste favoris -->
      <FavoritesList />
      <!-- liste pokémon -->
      <PokemonList />
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
  background: #222;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background: #444;
}

.lists {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
