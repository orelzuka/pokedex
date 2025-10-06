<script>
import { useFavoritesStore } from '../stores/useFavoritesStore'
import PokemonCard from './PokemonCard.vue'

export default {
  name: 'FavoritesList',
  components: { PokemonCard },
  setup() {
    const favStore = useFavoritesStore()
    return { favStore }
  },
}
</script>

<template>
  <h2>Mes Pokémons Favoris</h2>

  <!-- si aucun favori -->
  <p v-if="favStore.favorites.length === 0">Aucun Pokémon en favori pour le moment.</p>

  <!-- sinon, afficher la liste -->
  <div v-else class="favorites-list">
    <PokemonCard v-for="p in favStore.favorites" v-bind:key="p.id" v-bind:pokemon="p" />
  </div>
</template>

<style>
.favorites-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 65%;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: solid 2px #948a72;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  background: linear-gradient(
    45deg,
    rgba(237, 230, 204, 1) 8%,
    rgba(212, 201, 184, 1) 16%,
    rgba(237, 230, 204, 1) 25%,
    rgba(212, 201, 184, 1) 50%,
    rgba(237, 230, 204, 1) 74%,
    rgba(212, 201, 184, 1) 83%,
    rgba(237, 230, 204, 1) 95%
  );
}
</style>
