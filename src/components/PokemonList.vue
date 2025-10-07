<script>
import PokemonCard from './PokemonCard.vue'
import { fetchPokemonListWithDetails, fetchPokemonByName } from '../services/pokemonService.js'

export default {
  name: 'PokemonList',
  components: { PokemonCard },

  data() {
    return {
      pokemons: [],
      loading: false,
      error: null,

      // pagination
      offset: 0,
      limit: 21,

      // recherche
      searchQuery: '',
      searchedPokemon: null,
      debounceTimeout: null,
    }
  },

  watch: {
    searchQuery(newQuery) {
      clearTimeout(this.debounceTimeout)

      if (!newQuery.trim()) {
        this.searchedPokemon = null
        return
      }

      this.debounceTimeout = setTimeout(() => {
        this.searchPokemon()
      }, 400)
    },
  },

  methods: {
    // charger liste pokémon
    async loadPokemons() {
      this.loading = true
      this.error = null
      try {
        const { pokemons } = await fetchPokemonListWithDetails({
          limit: this.limit,
          offset: this.offset,
        })
        this.pokemons = [...this.pokemons, ...pokemons]
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // pagination
    async loadMore() {
      this.offset += this.limit
      await this.loadPokemons()
    },

    // rechercher pokémon
    async searchPokemon() {
      this.loading = true
      this.error = null
      try {
        const results = await fetchPokemonByName(this.searchQuery)
        this.searchedPokemon = results
      } catch (err) {
        this.searchedPokemon = null
        this.error = 'Aucun Pokémon trouvé...'
      } finally {
        this.loading = false
      }
    },

    // réinitialiser recherche
    clearSearch() {
      this.searchQuery = ''
      this.searchedPokemon = null
    },
  },

  mounted() {
    this.loadPokemons()
  },
}
</script>

<template>
  <h2>Pokédex National</h2>
  <!-- recherche -->
  <div class="search-container">
    <input
      v-model="searchQuery"
      v-on:keyup.enter="searchPokemon"
      placeholder="Rechercher un Pokémon..."
      class="search-input"
      type="text"
    />
    <button v-on:click="searchPokemon" class="search-btn">Rechercher</button>
    <button v-if="searchedPokemon" v-on:click="clearSearch" class="clear-btn">Réinitialiser</button>
  </div>

  <!-- erreurs -->
  <p v-if="error" class="error">{{ error }}</p>
  <p v-if="loading">Chargement...</p>

  <!-- résultat recherche -->
  <div v-if="searchedPokemon" class="pokemons-list">
    <PokemonCard
      v-for="pokemon in searchedPokemon"
      v-bind:key="pokemon.id"
      v-bind:pokemon="pokemon"
    />
  </div>

  <!-- si pas de recherche -->
  <div v-else class="pokemons-list">
    <PokemonCard v-for="pokemon in pokemons" v-bind:key="pokemon.id" v-bind:pokemon="pokemon" />
  </div>

  <!-- pagination -->
  <div v-if="!searchedPokemon" class="load-more-container">
    <button v-on:click="loadMore" v-bind:disabled="loading" class="load-more-btn">
      Charger plus
    </button>
  </div>
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
  border: solid 2px #707070;
  border-radius: 15px;
  background: linear-gradient(
    50deg,
    rgba(222, 222, 222, 1) 15%,
    rgba(196, 196, 196, 1) 30%,
    rgba(222, 222, 222, 1) 45%,
    rgba(196, 196, 196, 1) 60%,
    rgba(222, 222, 222, 1) 75%
  );
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  padding: 1rem;
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
  font-size: 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  width: 100%;
}

.search-btn,
.clear-btn,
.load-more-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 10px;
  background-color: #d32f2f;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover,
.clear-btn:hover,
.load-more-btn:hover {
  background-color: #b71c1c;
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}
</style>
