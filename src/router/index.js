import { createRouter, createWebHistory } from 'vue-router'
import PokemonList from '../components/PokemonList.vue'
import PokemonDetails from '../views/PokemonDetails.vue'

const routes = [
  {
    path: '/',
    name: 'PokemonList',
    component: PokemonList,
  },
  {
    path: '/pokemon/:id',
    name: 'PokemonDetails',
    component: PokemonDetails,
    props: true,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
