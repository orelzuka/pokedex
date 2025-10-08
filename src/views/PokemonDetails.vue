<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPokemonDetail } from '../services/pokemonService.js'

const route = useRoute()

const router = useRouter()

const paramId = computed(() => route.params.id)

const loading = ref(true)
const error = ref(null)
const pokemon = ref({
  id: null,
  name: '',
  image: '',
  types: [],
  stats: [],
  height: null,
  weight: null,
})

async function loadPokemon(identifier) {
  loading.value = true
  error.value = null
  try {
    const data = await fetchPokemonDetail(identifier)

    const imageUrl =
      data.sprites?.other?.['official-artwork']?.front_default ||
      data.sprites?.front_default ||
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`

    pokemon.value = {
      id: data.id,
      name: data.name,
      image: imageUrl,
      types: data.types.map((types) => types.type.name),
      stats: data.stats.map((stats) => ({ name: stats.stat.name, value: stats.base_stat })),
      height: data.height,
      weight: data.weight,
    }
  } catch (err) {
    error.value = err.message || 'Impossible de charger le Pokémon.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadPokemon(paramId.value)
})

watch(paramId, (newId) => {
  if (newId) loadPokemon(newId)
})

function goBack() {
  router.back()
}

// affichage des stats
const maxStat = computed(() => {
  const vals = pokemon.value.stats.map((stats) => stats.value)
  return Math.max(100, ...(vals.length ? vals : [100]))
})

function statFillWidth(value) {
  return `${Math.round((value / maxStat.value) * 100)}%`
}

function statLabel(rawName) {
  // mapping stat API
  const map = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    speed: 'Speed',
  }
  return map[rawName] || rawName
}
</script>

<template>
  <div class="details-page">
    <div v-if="loading" class="loading">Chargement du Pokémon...</div>

    <div v-else-if="error" class="error">
      {{ error }}
      <div><button v-on:click="goBack">Retour</button></div>
    </div>

    <article v-else class="pokemon-details">
      <header class="header">
        <p class="pokemon-name">{{ pokemon.name }}</p>
        <div class="types">
          <span v-for="type in pokemon.types" v-bind:key="type" class="type-badge">{{ type }}</span>
        </div>
      </header>

      <div class="main">
        <img v-bind:src="pokemon.image" v-bind:alt="pokemon.name" class="artwork" />

        <section class="pokemon-infos">
          <p>N° : {{ pokemon.id }}</p>
          <p>Height : {{ pokemon.height }}</p>
          <p>Weight : {{ pokemon.weight }}</p>
        </section>
      </div>

      <section class="stats">
        <h2>Stats :</h2>
        <div class="stat-row" v-for="stat in pokemon.stats" v-bind:key="stat.name">
          <div class="stat-name">{{ statLabel(stat.name) }}</div>
          <div class="stat-bar">
            <div class="stat-fill" v-bind:style="{ width: statFillWidth(stat.value) }"></div>
          </div>
          <div class="stat-value">{{ stat.value }}</div>
        </div>
      </section>
      <button class="back-btn" v-on:click="goBack">Retour</button>
    </article>
  </div>
</template>

<style scoped>
.details-page {
  max-width: 900px;
  margin: 1.5rem auto;
  padding: 1rem;
}

.back-btn {
  background: #212121;
  border: 2px solid #212121;
  color: #fff;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s ease;
  margin-top: 1rem;
}

.back-btn:hover {
  background: #444444;
  color: #fff;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #b00020;
  text-align: center;
  padding: 1rem;
}

.pokemon-details {
  width: 500px;
  color: #eee;
  background: linear-gradient(
    0deg,
    rgba(204, 0, 0, 1) 50%,
    rgba(255, 0, 0, 1) 75%,
    rgba(192, 0, 12, 1) 100%
  );
  border: 5px solid #212121;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pokemon-name {
  font-size: x-large;
  font-weight: bold;
  text-transform: uppercase;
  margin: 0;
  color: #eee;
}

.types {
  display: flex;
  gap: 0.4rem;
}

.type-badge {
  background-color: lightblue;
  color: #212121;
  padding: 0.25rem 1rem;
  border-radius: 50px;
  text-transform: capitalize;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  border: 3px solid #212121;
}

.main {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-top: 1rem;
}

.artwork {
  width: 260px;
  height: 260px;
  object-fit: contain;
  background: linear-gradient(180deg, #fff, #f6f6f6);
  border-radius: 12px;
  padding: 0.5rem;
  border: 5px solid #212121;
}

.pokemon-infos {
  font-size: 1rem;
}

.stats {
  margin-top: 1.25rem;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.6rem;
}

.stat-name {
  width: 110px;
  font-weight: 600;
  text-transform: none;
}

.stat-bar {
  flex: 1;
  height: 12px;
  background: #eee;
  border-radius: 50px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd54f, #ffb300);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.stat-value {
  width: 48px;
  text-align: right;
  font-weight: 700;
}
</style>
