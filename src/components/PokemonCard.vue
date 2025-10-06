<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '../stores/useFavoritesStore'

// props : chaque carte reçoit un objet "pokemon"
const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
})

// store pinia
const favStore = useFavoritesStore()

// ✅ identifiant unifié (pour gérer à la fois les Pokémon normaux et ceux de Supabase)
const pokemonId = computed(() => props.pokemon.pokemon_id || props.pokemon.id)

// ✅ vérifie si le Pokémon est déjà en favoris
const isFav = computed(() => favStore.isFavorite(pokemonId.value))

// ✅ ajoute ou retire le Pokémon des favoris
const toggleFav = async () => {
  await favStore.toggleFavorite({
    id: pokemonId.value,
    name: props.pokemon.name,
    image: props.pokemon.image,
    types: props.pokemon.types,
  })
}
</script>

<template>
  <div class="pokemon-card">
    <h2 class="name">{{ pokemon.name }}</h2>
    <img :src="pokemon.image" :alt="pokemon.name" class="image" />

    <!-- bouton "favoris" -->
    <div class="fav-btn-container">
      <button class="fav-btn" @click.stop="toggleFav">
        <!-- l'étoile se remplit dynamiquement -->
        <span v-if="isFav">★</span>
        <span v-else>☆</span>
      </button>
    </div>

    <p>N° {{ pokemonId }}</p>

    <!-- affichage dynamique Type / Types -->
    <p v-if="pokemon.types && pokemon.types.length" class="types">
      {{ pokemon.types.length > 1 ? 'Types' : 'Type' }} :
      {{ pokemon.types.join(', ') }}
    </p>
    <p v-else class="types">Type inconnu</p>
  </div>
</template>

<style>
.pokemon-card {
  border: 5px solid #212121;
  border-radius: 40%;
  text-align: center;
  width: 275px;
  height: 275px;
  margin: 1rem;
  color: #212121;
  background: linear-gradient(
    0deg,
    rgba(238, 238, 238, 1) 50%,
    rgba(204, 0, 0, 1) 50%,
    rgba(255, 0, 0, 1) 75%,
    rgba(192, 0, 12, 1) 100%
  );
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.pokemon-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.name {
  font-weight: bold;
  text-transform: capitalize;
  color: #eeeeee;
}

.types {
  text-transform: capitalize;
}

.fav-btn {
  display: block;
  padding: 0px 10px 5px 10px;
  border: none;
  border-radius: 45%;
  cursor: pointer;
  background: #212121;
  color: #eeeeee;
  font-size: 2rem;
  transition:
    background 0.2s ease,
    transform 0.2s ease;
}

.fav-btn:hover {
  background: #444;
  transform: scale(1.1);
}

.fav-btn-container {
  display: flex;
  justify-content: center;
}
</style>
