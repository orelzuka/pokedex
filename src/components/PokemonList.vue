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
      limit: 20,
      offset: 0,
      allLoaded: false,
      searchQuery: '',
      searchedPokemon: null,
    }
  },
  methods: {
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

    // recherche pokémon par nom
    async searchPokemon() {
      if (!this.searchQuery.trim()) {
        this.searchedPokemon = null
        return
      }

      this.loading = true
      this.error = null

      try {
        const pokemon = await fetchPokemonByName(this.searchQuery.trim().toLowerCase())
        this.searchedPokemon = pokemon
      } catch (err) {
        this.searchedPokemon = null
        this.error = 'Pokémon introuvable'
      } finally {
        this.loading = false
      }
    },

    // réinitialise la recherche
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

<!-- "bouton charger plus" (remplacé par un "infinite scroll")
  <div class="controls" v-if="!loading && pokemons.length < totalCount">
    <button v-on:click="loadPokemons">Charger plus</button>
  </div> -->
<template>
  <h2>Pokédex National</h2>
  <!-- Champ de recherche -->
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
    <PokemonCard :pokemon="searchedPokemon" />
  </div>

  <!-- liste complète (si pas de recherche) -->
  <div v-else class="pokemons-list">
    <PokemonCard v-for="p in pokemons" :key="p.id" :pokemon="p" />
  </div>

  <!-- pagination -->
  <div v-if="!searchedPokemon" class="load-more-container">
    <button v-on:click="loadMore" v-bind:disabled="loading" class="load-more-btn">
      Charger plus
    </button>
  </div>
</template>

<style>
.error {
  color: red;
}

.pokemons-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 70%;
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
