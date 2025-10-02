<script>
import PokemonList from './components/PokemonList.vue'

export default {
  name: 'App',
  components: { PokemonList },
}
</script>

<template>
  <div id="app">
    <h1>Pokédex en Vue.js</h1>
    <PokemonList />
  </div>
</template>

<style>
.pokedex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1000px;
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
