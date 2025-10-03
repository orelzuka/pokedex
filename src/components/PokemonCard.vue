<script>
import { useFavoritesStore } from '../stores/useFavoritesStore'

export default {
  name: 'PokemonCard',
  props: {
    pokemon: {
      type: Object,
    },
  },
  data() {
    return {
      favStore: null,
    }
  },
  created() {
    this.favStore = useFavoritesStore()
  },
  computed: {
    isFav() {
      return this.favStore.isFavorite(this.pokemon.id)
    },
  },
  methods: {
    toggleFav() {
      this.favStore.toggleFavorite({
        id: this.pokemon.id,
        name: this.pokemon.name,
        image: this.pokemon.image,
        types: this.pokemon.types,
      })
    },
  },
}
</script>

<template>
  <div class="pokemon-card">
    <h2 class="name">{{ pokemon.name }}</h2>
    <img v-bind:src="pokemon.image" v-bind:alt="pokemon.name" class="image" />
    <!-- bouton "favoris" -->
    <div class="fav-btn-container">
      <button class="fav-btn" @click.stop="toggleFav">
        <span v-if="isFav">★</span>
        <span v-else>☆</span>
      </button>
    </div>
    <p>N° {{ pokemon.id }}</p>

    <!-- affichage dynamique au singulier ou au pluriel selon le nombre de types du pokemon-->
    <p v-if="pokemon.types && pokemon.types.length" class="types">
      {{ pokemon.types.length > 1 ? 'Types' : 'Type' }} : {{ pokemon.types.join(', ') }}
    </p>
    <p v-else class="types">Type inconnu</p>
  </div>
</template>

<style>
.pokemon-card {
  border: 10px solid #212121;
  border-radius: 40%;
  padding: 0.5rem;
  text-align: center;
  width: 260px;
  height: 260px;
  margin: 1rem;
  color: #212121;
  background: linear-gradient(
    0deg,
    rgba(238, 238, 238, 1) 50%,
    rgba(204, 0, 0, 1) 50%,
    rgba(255, 0, 0, 1) 75%,
    rgba(192, 0, 12, 1) 100%
  );
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.pokemon-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.name {
  font-weight: bold;
  text-transform: capitalize;
  color: #eeeeee;
}

.image {
  width: 40%;
}

.types {
  text-transform: capitalize;
}

.fav-btn {
  display: block;
  padding: 0px 10px 5px 10px;
  border: none;
  border-radius: 45%;
  cursor: pointer;
  background: #212121;
  color: #eeeeee;
  font-size: 2rem;
  transition: background 0.2s ease;
}

.fav-btn:hover {
  background: #444;
}

.fav-btn-container {
  display: flex;
  justify-content: center;
}
</style>
