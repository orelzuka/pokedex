<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFavoritesStore } from '../stores/useFavoritesStore'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

// store pinia
const favStore = useFavoritesStore()

const pokemonId = computed(() => props.pokemon.pokemon_id || props.pokemon.id)

// vérifie si lepokémon est déjà en favori
const isFav = computed(() => favStore.isFavorite(pokemonId.value))

const goToDetails = () => {
  router.push({ name: 'PokemonDetails', params: { id: pokemonId.value } })
}

const animateStar = ref(false)

// ajoute /retire favori
const toggleFav = async () => {
  await favStore.toggleFavorite({
    id: pokemonId.value,
    name: props.pokemon.name,
    image: props.pokemon.image,
    types: props.pokemon.types,
  })
}

watch(isFav, (newVal) => {
  if (newVal) {
    animateStar.value = true
    setTimeout(() => (animateStar.value = false), 600)
  }
})
</script>

<template>
  <div class="pokemon-card" v-on:click="goToDetails">
    <p class="name">{{ pokemon.name }}</p>
    <img v-bind:src="pokemon.image" v-bind:alt="pokemon.name" class="image" />

    <!-- bouton favori -->
    <div class="fav-btn-container">
      <button class="fav-btn" v-on:click.stop="toggleFav">
        <span
          v-bind:class="[isFav ? 'star-active' : 'star-inactive', { 'star-animate': animateStar }]"
        >
          ★
        </span>
      </button>
    </div>

    <p>N° {{ pokemonId }}</p>

    <!-- affichage dynamique des types -->
    <p v-if="pokemon.types && pokemon.types.length" class="types">
      {{ pokemon.types.length > 1 ? 'Types' : 'Type' }} :
      {{ pokemon.types.join(', ') }}
    </p>
    <p v-else class="types">Type inconnu</p>
  </div>
</template>

<style scoped>
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
  font-size: x-large;
  text-transform: capitalize;
  color: #eeeeee;
}

.image {
  width: 27.5%;
}

.types {
  text-transform: capitalize;
}

.fav-btn {
  display: block;
  padding: 0px 10px 5px 10px;
  margin-bottom: 0.5rem;
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

.star-active {
  color: gold;
  text-shadow:
    0 0 10px gold,
    0 0 20px orange;
}

.star-inactive {
  color: #ccc;
}

/* animation etoile fav */
@keyframes starPop {
  0% {
    transform: scale(1);
    text-shadow: 0 0 5px gold;
  }
  40% {
    transform: scale(1.6) rotate(10deg);
    text-shadow:
      0 0 15px gold,
      0 0 25px orange;
  }
  100% {
    transform: scale(1);
    text-shadow: 0 0 5px gold;
  }
}

.star-animate {
  animation: starPop 0.6s ease-out;
}
</style>
