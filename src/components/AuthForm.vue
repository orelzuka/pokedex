<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useFavoritesStore } from '../stores/useFavoritesStore'

// etats réactifs
const email = ref('')
const password = ref('')
const message = ref('')
const isLogin = ref(true)

// store pinia
const favStore = useFavoritesStore()

// inscription
const signUp = async () => {
  message.value = ''
  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })
    if (error) throw error
    message.value = 'Inscription réussie ! Vous pouvez maintenant vous connecter.'
  } catch (err) {
    message.value = ` ${err.message}`
  }
}

// connexion
const signIn = async () => {
  message.value = ''
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (error) throw error

    message.value = 'Connexion réussie !'
    await favStore.init() // recharge les favoris après connexion
  } catch (err) {
    message.value = `${err.message}`
  }
}

// deconnexion
const signOut = async () => {
  try {
    await supabase.auth.signOut()
    favStore.user = null
    favStore.favorites = []
    message.value = 'Déconnecté'
  } catch (err) {
    message.value = `Erreur : ${err.message}`
  }
}
</script>

<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>

    <!-- champs -->
    <input v-model="email" placeholder="Email" type="email" />
    <input v-model="password" placeholder="Mot de passe" type="password" />

    <!-- connexion /iinscription -->
    <button v-if="isLogin" v-on:click="signIn">Se connecter</button>
    <button v-else v-on:click="signUp">S'inscrire</button>

    <!-- Basculer entre les deux modes -->
    <p class="switch-mode" v-on:click="isLogin = !isLogin">
      {{ isLogin ? 'Pas encore de compte ? Créez-en un !' : 'Déjà un compte ? Connectez-vous !' }}
    </p>

    <!-- Message retour -->
    <p v-if="message" class="message">{{ message }}</p>

    <!-- Bouton déconnexion -->
    <button v-on:click="signOut" class="logout">Se déconnecter</button>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border: 2px solid #ccc;
  border-radius: 12px;
  padding: 1.5rem;
  width: 400px;
  margin: 3rem auto;
  color: #212121;
  background-color: #f9f9f9;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

input {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #bbb;
  width: 100%;
  font-size: 1rem;
}

button {
  background: #d32f2f;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

button:hover {
  background: #b71c1c;
}

.switch-mode {
  cursor: pointer;
  font-size: 0.9rem;
  color: #007bff;
  text-decoration: underline;
}

.switch-mode:hover {
  color: #0056b3;
}

.message {
  font-size: 0.9rem;
  color: #333;
}

.logout {
  background: #555;
  margin-top: 1rem;
}

.logout:hover {
  background: #333;
}
</style>
