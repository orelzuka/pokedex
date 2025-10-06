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
      limit: 21, // nb pokémon par page
      offset: 0, // position actuelle
      totalCount: null, // total renvoyé par l’API
    }
  },
  methods: {
    // chargement d'une page
    async loadPokemons() {
      this.loading = true
      this.error = null

      try {
        // appel API avec limit et offset
        const data = await fetchPokemonList(this.limit, this.offset)
        if (this.totalCount === null) this.totalCount = data.count

        // récupération détails pokémon
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

        // ajout nouveaux pokémons à la liste existante
        this.pokemons.push(...details)

        // prochain offset
        this.offset += this.limit
      } catch (err) {
        console.error(err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    // chargement initial
    this.loadPokemons()
  },
}
</script>

<template>
  <h2>Pokédex National</h2>

  <p v-if="error" class="error">{{ error }}</p>
  <p v-if="loading && pokemons.length === 0">Chargement...</p>

  <div v-if="pokemons.length" class="pokemons-list">
    <PokemonCard v-for="p in pokemons" v-bind:key="p.id" :pokemon="p" />
  </div>

  <!-- bouton charger plus -->
  <div class="controls" v-if="!loading && pokemons.length < totalCount">
    <button v-on:click="loadPokemons">Charger plus</button>
  </div>

  <p v-if="loading && pokemons.length > 0">Chargement des suivants...</p>
  <p v-if="pokemons.length >= totalCount && totalCount !== null" class="end">
    Tous les Pokémon sont chargés.
  </p>
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
  max-width: 70%;
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
  margin-top: 1rem;
  color: #555;
}
</style>
