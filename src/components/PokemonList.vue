<script setup>
import { ref, onMounted, watch } from 'vue'
import PokemonCard from './PokemonCard.vue'
import { fetchPokemonListWithDetails, fetchPokemonByName } from '../services/pokemonService.js'

// etats reactifs
const pokemonList = ref([])
const isLoading = ref(false)
const fetchError = ref(null)

// pagination
const currentOffset = ref(0)
const pageLimit = ref(21)

// recherche
const searchInput = ref('')
const searchResults = ref(null)
const debounceTimer = ref(null)

// chargement liste
const loadPokemonList = async () => {
  if (isLoading.value) return

  isLoading.value = true
  fetchError.value = null

  try {
    const { pokemons: newPokemonBatch } = await fetchPokemonListWithDetails({
      limit: pageLimit.value,
      offset: currentOffset.value,
    })

    pokemonList.value = [...pokemonList.value, ...newPokemonBatch]
  } catch (err) {
    fetchError.value = err?.message || String(err)
  } finally {
    isLoading.value = false
  }
}

// charger plus
const loadNextPage = async () => {
  currentOffset.value += pageLimit.value
  await loadPokemonList()
}

// infinite scroll
const infiniteScrollTarget = ref(null)

const setupInfiniteScroll = () => {
  const observer = new IntersectionObserver(
    async (entries) => {
      const observedElement = entries[0]
      const reachedBottom = observedElement.isIntersecting

      if (reachedBottom && !isLoading.value && !searchResults.value) {
        await loadNextPage()
      }
    },
    { root: null, rootMargin: '0px', threshold: 0.5 },
  )

  if (infiniteScrollTarget.value) {
    observer.observe(infiniteScrollTarget.value)
  }
}

// recherche
const searchPokemon = async () => {
  const trimmedSearchQuery = (searchInput.value || '').toString().trim()

  if (!trimmedSearchQuery) {
    searchResults.value = null
    return
  }

  isLoading.value = true
  fetchError.value = null

  try {
    const pokemonSearchResults = await fetchPokemonByName(trimmedSearchQuery)

    if (Array.isArray(pokemonSearchResults)) {
      searchResults.value = pokemonSearchResults
    } else if (pokemonSearchResults) {
      searchResults.value = [pokemonSearchResults]
    } else {
      searchResults.value = []
    }
  } catch (err) {
    searchResults.value = []
    fetchError.value = 'Aucun Pokémon trouvé...'
  } finally {
    isLoading.value = false
  }
}

// reset recherche
const resetSearch = () => {
  searchInput.value = ''
  searchResults.value = null
}

watch(searchInput, (newSearchValue) => {
  clearTimeout(debounceTimer.value)

  if (!newSearchValue || !newSearchValue.trim()) {
    searchResults.value = null
    return
  }

  debounceTimer.value = setTimeout(() => {
    searchPokemon()
  }, 400)
})

onMounted(async () => {
  await loadPokemonList()
  setupInfiniteScroll()
})
</script>

<template>
  <h2>Pokédex National</h2>

  <!-- recherche -->
  <div class="search-container">
    <input
      v-model="searchInput"
      v-on:keyup.enter="searchPokemon"
      placeholder="Rechercher un Pokémon..."
      class="search-input"
      type="text"
    />
    <button v-on:click="searchPokemon" class="search-btn">Rechercher</button>
    <button v-if="searchResults" v-on:click="resetSearch" class="clear-btn">Réinitialiser</button>
  </div>

  <!-- errors/loading -->
  <p v-if="fetchError" class="error">{{ fetchError }}</p>
  <p v-if="isLoading && !pokemonList.length && !(searchResults && searchResults.length)">
    Chargement...
  </p>

  <!-- resultat recherche -->
  <div v-if="searchResults && searchResults.length" class="pokemons-list">
    <PokemonCard
      v-for="pokemon in searchResults"
      v-bind:key="pokemon.id"
      v-bind:pokemon="pokemon"
    />
  </div>

  <!-- si pas de résultat -->
  <p v-else-if="searchResults && searchResults.length === 0" class="no-result">
    Aucun résultat pour "{{ searchInput }}"
  </p>

  <!-- liste -->
  <div v-else class="pokemons-list">
    <PokemonCard v-for="pokemon in pokemonList" v-bind:key="pokemon.id" v-bind:pokemon="pokemon" />
  </div>

  <!-- infinite scroll -->
  <div v-if="!searchResults" ref="infiniteScrollTarget" class="infinite-scroll-trigger"></div>
</template>

<style scoped>
.error {
  color: red;
}
.pokemons-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 65%;
  margin: 1rem auto;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #707070;
  border-radius: 15px;
  background: linear-gradient(50deg, #dedede 15%, #c4c4c4 30%, #dedede 45%);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  width: 65%;
  max-width: 600px;
}
.search-input {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  width: 100%;
}
.search-btn,
.clear-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  background-color: #d32f2f;
  color: white;
  cursor: pointer;
}
.infinite-scroll-trigger {
  height: 20px;
  width: 100%;
}
.no-result {
  text-align: center;
  color: #555;
  margin-top: 1rem;
}
</style>
