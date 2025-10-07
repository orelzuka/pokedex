<script>
import PokemonCard from './PokemonCard.vue'
import { fetchPokemonList, fetchPokemonDetail } from '../services/pokemonService.js'

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
    }
  },
  methods: {
    async loadPokemons() {
      if (this.loading || this.allLoaded) return

      this.loading = true
      this.error = null
      try {
        const data = await fetchPokemonList(this.limit, this.offset)

        // si l'API ne renvoie plus de résultats
        if (!data.results.length) {
          this.allLoaded = true
          return
        }

        const details = await Promise.all(
          data.results.map(async (pokemon) => {
            const detail = await fetchPokemonDetail(pokemon.name)
            return {
              id: detail.id,
              name: detail.name,
              image: detail.sprites?.front_default,
              types: detail.types.map((types) => types.type.name),
            }
          }),
        )

        this.pokemons.push(...details)
        this.offset += this.limit
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // chargement en bas de page
    handleScroll() {
      const bottomOfPage = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200

      if (bottomOfPage && !this.loading && !this.allLoaded) {
        this.loadPokemons()
      }
    },
  },
  mounted() {
    this.loadPokemons()
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
}
</script>

<template>
  <h2>Pokédex National</h2>
  <p v-if="error" class="error">{{ error }}</p>

  <div v-if="pokemons.length" class="pokemons-list">
    <PokemonCard v-for="pokemon in pokemons" v-bind:key="pokemon.id" v-bind:pokemon="pokemon" />
  </div>
  <!-- "bouton charger plus" (remplacé par un "infinite scroll")
  <div class="controls" v-if="!loading && pokemons.length < totalCount">
    <button v-on:click="loadPokemons">Charger plus</button>
  </div> -->
  <p v-if="loading">Chargement...</p>
  <p v-if="allLoaded" class="end">Tous les Pokémon ont été chargés.</p>
</template>

<style>
.error {
  color: red;
  margin-bottom: 1rem;
}

.pokemons-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 65%;
  gap: 0.5rem;
  margin: 1rem auto;
  border: solid 2px #707070;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background: linear-gradient(
    50deg,
    rgba(222, 222, 222, 1) 15%,
    rgba(196, 196, 196, 1) 30%,
    rgba(222, 222, 222, 1) 45%,
    rgba(196, 196, 196, 1) 60%,
    rgba(222, 222, 222, 1) 75%
  );
}

.controls {
  text-align: center;
  margin-top: 1rem;
}

.controls button {
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  border: none;
  background-color: #e3350d;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.controls button:hover {
  background-color: #c12d0b;
}

.end {
  text-align: center;
  font-style: italic;
  color: #555;
  margin: 1rem;
}
</style>
