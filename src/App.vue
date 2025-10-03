<script>
import FavoritesList from './components/FavoritesList.vue'
import PokemonList from './components/PokemonList.vue'

export default {
  name: 'App',
  components: { FavoritesList, PokemonList },
}
</script>

<template>
  <h1>TP : Pokédex en Vue.js</h1>
  <FavoritesList />
  <PokemonList />
</template>

<style></style>
