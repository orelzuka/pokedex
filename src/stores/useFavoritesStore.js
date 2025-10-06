import { defineStore } from 'pinia'
import { supabase } from '../lib/supabaseClient'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [],
    user: null,
    loading: false,
  }),

  getters: {
    // vérifie si un pokémon est déjà en favori
    isFavorite: (state) => {
      return (id) => state.favorites.some((p) => p.pokemon_id === id)
    },

    // nombre total de favoris
    count: (state) => state.favorites.length,
  },

  actions: {
    // initialisation changements d'utilisateur et charge les favoris
    async init() {
      const { data } = await supabase.auth.getUser()
      this.user = data?.user || null

      // écoute connexion / déconnexion
      supabase.auth.onAuthStateChange(async (_, session) => {
        this.user = session?.user ?? null
        if (this.user) {
          await this.loadFavorites()
        } else {
          this.favorites = []
        }
      })

      if (this.user) {
        await this.loadFavorites()
      }
    },

    // récupère les favoris depuis supabase
    async loadFavorites() {
      if (!this.user) return
      this.loading = true

      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', this.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur lors du chargement des favoris:', error)
      } else {
        this.favorites = data || []
      }

      this.loading = false
    },

    // ajoute un ookémon en favori
    async addFavorite(pokemon) {
      if (!this.user) {
        alert('Connecte-toi pour ajouter un favori')
        return
      }

      const pokemonId = pokemon.pokemon_id || pokemon.id
      if (this.isFavorite(pokemonId)) return

      const { data, error } = await supabase
        .from('favorites')
        .insert({
          user_id: this.user.id,
          pokemon_id: pokemonId,
          name: pokemon.name,
          image: pokemon.image,
          types: Array.isArray(pokemon.types) ? pokemon.types : [],
        })
        .select()

      if (error) {
        console.error('Erreur ajout favori:', error)
      } else if (data && data.length) {
        // ajoute le favori dans la liste locale
        this.favorites.unshift(data[0])
      }
    },

    // supprime un Pokémon des favoris
    async removeFavorite(pokemonId) {
      if (!this.user) {
        alert('Connecte-toi pour retirer un favori')
        return
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .match({ user_id: this.user.id, pokemon_id: pokemonId })

      if (error) {
        console.error('Erreur suppression favori:', error)
      } else {
        // met à jour la liste locale après suppression
        this.favorites = this.favorites.filter((p) => p.pokemon_id !== pokemonId)
      }
    },

    // 🔁 Ajoute ou retire un Pokémon des favoris selon l’état
    async toggleFavorite(pokemon) {
      if (!pokemon) return

      // ✅ identifiant unifié (fonctionne pour les 2 cas)
      const pokemonId = pokemon.pokemon_id || pokemon.id
      if (!pokemonId) return

      const isFav = this.isFavorite(pokemonId)

      if (isFav) {
        await this.removeFavorite(pokemonId)
      } else {
        await this.addFavorite(pokemon)
      }
    },
  },
})
