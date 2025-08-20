<template>
  <div class="alta-usuario">
    <h2>Registro de Usuario</h2>
    <form @submit.prevent="registrarUsuario" class="form-container">
      <div class="form-group">
        <label>Nombre:</label>
        <input v-model="form.name" type="text" required />
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input v-model="form.email" type="email" required :class="{ 'is-invalid': errors.email }" />
        <small v-if="errors.email" class="error">{{ errors.email }}</small>
      </div>

      <div class="form-group">
        <label>Contraseña:</label>
        <input
          v-model="form.password"
          type="password"
          required
          :class="{ 'is-invalid': errors.password }"
        />
        <small v-if="errors.password" class="error">{{ errors.password }}</small>
      </div>

      <button type="submit" class="btn">Registrar</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const validarFormulario = () => {
  let valido = true
  errors.email = ''
  errors.password = ''

  // Validación de email con regex
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regexEmail.test(form.email)) {
    errors.email = 'Debe ser un correo válido (ej: usuario@dominio.com)'
    valido = false
  }

  // Validación de contraseña
  if (form.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres'
    valido = false
  }

  return valido
}

const registrarUsuario = async () => {
  if (!validarFormulario()) {
    return
  }

  try {
    const response = await axios.post('http://localhost:8000/api/register', form, {
      headers: {
        Authorization: `Bearer ${userStore.token}`,
      },
    })
    alert('Usuario registrado con éxito: ' + response.data.user.name)

    // limpiar formulario
    form.name = ''
    form.email = ''
    form.password = ''
  } catch (error) {
    console.error(error)
    if (error.response) {
      alert(`Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`)
    } else {
      alert('Error al conectar con el servidor')
    }
  }
}
</script>
