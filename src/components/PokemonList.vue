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
    }
  },
  methods: {
    async loadPokemons() {
      this.loading = true
      this.error = null
      try {
        // récupérer la liste des 20 premiers ookémon
        const data = await fetchPokemonList(20, 0)

        // récupérer les détails de chaque pokémon
        const details = await Promise.all(
          data.results.map(async (p) => {
            const d = await fetchPokemonDetail(p.name)
            return {
              id: d.id,
              name: d.name,
              image: d.sprites?.front_default,
              types: d.types.map((t) => t.type.name),
            }
          }),
        )

        // stocker les détails des pokemons
        this.pokemons = details
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.loadPokemons()
  },
}
</script>

<template>
  <div>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading">Chargement...</p>

    <div v-if="pokemons.length" class="pokedex">
      <PokemonCard v-for="p in pokemons" :key="p.id" :pokemon="p" />
    </div>
  </div>
</template>

<style scoped>
.pokedex {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.error {
  color: red;
}
</style>
