// stores/user.js
import { defineStore } from 'pinia'
import axios from '@/api/axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(credentials) {
      const response = await axios.post('/login', credentials)
      this.token = response.data.access_token
      this.user = response.data.user

      // Guardar en localStorage
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))

      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    },
    async fetchUser() {
      if (!this.token) return
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      try {
        const response = await axios.get('/user')
        this.user = response.data
      } catch (error) {
        console.error('Error al obtener usuario:', error)
      }
    },
    async logout() {
      await axios.post(
        '/logout',
        {},
        {
          headers: { Authorization: `Bearer ${this.token}` },
        },
      )
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },
  },
})
