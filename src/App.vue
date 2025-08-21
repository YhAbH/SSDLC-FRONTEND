<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import axios from './api/axios'

onMounted(() => {
  getUser()
})

const getUser = async () => {
  try {
    const response = await axios.get('/user') // <- ya tu baseURL en axios es /api
    //console.log('Usuario autenticado:', response.data)
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('Usuario no autenticado')
    } else {
      console.error('Error al obtener usuario:', error.response)
    }
  }
}
</script>
