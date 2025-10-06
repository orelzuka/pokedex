<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useFavoritesStore } from '../stores/useFavoritesStore'

// champs du formulaire
const email = ref('')
const password = ref('')
const message = ref('')
const isLogin = ref(true)

const favStore = useFavoritesStore()

// inscription
const signUp = async () => {
  message.value = ''
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })
  if (error) message.value = error.message
  else message.value = 'Inscription réussie'
}

// connexion
const signIn = async () => {
  message.value = ''
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) message.value = error.message
  else {
    message.value = 'Connexion réussie'
    await favStore.init()
  }
}

// déconnexion
const signOut = async () => {
  await supabase.auth.signOut()
  favStore.user = null
  favStore.favorites = []
  message.value = 'Déconnecté'
}
</script>

<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>

    <input v-model="email" placeholder="Email" type="email" />
    <input v-model="password" placeholder="Mot de passe" type="password" />

    <button v-if="isLogin" v-on:click="signIn">Se connecter</button>
    <button v-else v-on:click="signUp">S'inscrire</button>

    <p class="switch-mode" v-on:click="isLogin = !isLogin">
      {{ isLogin ? 'Pas encore de compte ?' : 'Déjà un compte ?' }}
    </p>

    <p v-if="message" class="message">{{ message }}</p>

    <button v-on:click="signOut" class="logout">Se déconnecter</button>
  </div>
</template>

<style>
.auth-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 1rem;
  width: 500px;
  margin: 3rem auto;
  color: #212121;
  background-color: #f9f9f9;
}
input {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #bbb;
}
button {
  padding: 0.5rem;
  border: none;
  background: #cc0000;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}
button:hover {
  background: #ff4444;
}
.switch-mode {
  cursor: pointer;
  font-size: 0.9rem;
  color: #007bff;
}
.message {
  font-size: 0.9rem;
  color: #333;
}
.logout {
  background: #555;
}
.logout:hover {
  background: #333;
}
</style>
