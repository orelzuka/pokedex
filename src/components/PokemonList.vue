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
  <h2>Pokédex National</h2>
  <p v-if="error" class="error">{{ error }}</p>
  <p v-if="loading">Chargement...</p>

  <div v-if="pokemons.length" class="pokemons-list">
    <PokemonCard v-for="p in pokemons" v-bind:key="p.id" :pokemon="p" />
  </div>
</template>

<style>
.error {
  color: red;
}

.pokemons-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 70%;
  gap: 0.5rem;
  margin-top: 1rem;
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
</style>
