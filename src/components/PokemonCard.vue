<script>
export default {
  name: 'PokemonCard',
  props: {
    pokemon: {
      type: Object,
    },
  },
}
</script>

<template>
  <div class="pokemon-card">
    <h2 class="name">{{ pokemon.name }}</h2>
    <img v-bind:src="pokemon.image" v-bind:alt="pokemon.name" />
    <p>N° {{ pokemon.id }}</p>
    <p>Type(s) :</p>
    <p v-for="t in pokemon.types" v-bind:key="t" class="type">{{ t }}</p>
  </div>
</template>

<style>
.pokemon-card {
  border: 5px solid #212121;
  border-radius: 30%;
  padding: 0.5rem;
  text-align: center;
  width: 275px;
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

.type {
  text-transform: capitalize;
}
</style>
