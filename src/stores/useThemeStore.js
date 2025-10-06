import { defineStore } from 'pinia'

const THEME_KEY = 'vue-pokedex-theme'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem(THEME_KEY) || 'light',
  }),

  getters: {
    isDark: (state) => state.theme === 'dark',
  },

  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem(THEME_KEY, this.theme)
      this.applyTheme()
    },

    applyTheme() {
      if (this.theme === 'dark') {
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
      }
    },
  },
})
