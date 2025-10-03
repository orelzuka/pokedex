import { defineStore } from 'pinia'

const LOCAL_KEY = 'vue-pokedex-favorites-v1'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [],
  }),

  getters: {
    isFavorite: (state) => {
      return (id) => state.favorites.some((p) => p.id === id)
    },
    count: (state) => state.favorites.length,
  },

  actions: {
    loadFromLocalStorage() {
      try {
        const raw = localStorage.getItem(LOCAL_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) {
            this.favorites = parsed
          }
        }
      } catch (err) {}
    },

    saveToLocalStorage() {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(this.favorites))
      } catch (err) {}
    },

    addFavorite(pokemon) {
      if (!pokemon || pokemon.id == null) return
      if (!this.isFavorite(pokemon.id)) {
        const toStore = {
          id: pokemon.id,
          name: pokemon.name || '',
          image: pokemon.image || '',
          types: pokemon.types || [],
        }
        this.favorites.push(toStore)
        this.saveToLocalStorage()
      }
    },

    removeFavorite(id) {
      this.favorites = this.favorites.filter((p) => p.id !== id)
      this.saveToLocalStorage()
    },

    toggleFavorite(pokemon) {
      if (!pokemon || pokemon.id == null) return
      if (this.isFavorite(pokemon.id)) {
        this.removeFavorite(pokemon.id)
      } else {
        this.addFavorite(pokemon)
      }
    },

    init() {
      this.loadFromLocalStorage()
      this.$subscribe(() => {
        try {
          localStorage.setItem(LOCAL_KEY, JSON.stringify(this.favorites))
        } catch (err) {}
      })
    },
  },
})
