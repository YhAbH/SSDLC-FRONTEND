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
      <button type="button" class="btn secondary" @click="obtenerUsuarios">Ver Usuarios</button>
    </form>

    <div v-if="usuarios.length" class="usuarios-lista">
      <h3>Lista de Usuarios</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in usuarios" :key="u.id">
            <td>{{ u.name }}</td>
            <td>{{ u.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import api from '@/api/axios'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// Mantener token en headers si existe
if (userStore.token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${userStore.token}`
}

const form = reactive({
  name: '',
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const usuarios = ref([])

const validarFormulario = () => {
  let valido = true
  errors.email = ''
  errors.password = ''

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regexEmail.test(form.email)) {
    errors.email = 'Debe ser un correo válido (ej: usuario@dominio.com)'
    valido = false
  }

  if (form.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
    valido = false
  }

  return valido
}

const registrarUsuario = async () => {
  if (!validarFormulario()) return

  try {
    const response = await api.post('/register', form)
    alert('Usuario registrado: ' + response.data.user.name)
    form.name = ''
    form.email = ''
    form.password = ''
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.message || 'Error al conectar con el servidor')
  }
}

const obtenerUsuarios = async () => {
  if (!userStore.token) {
    alert('Debes iniciar sesión primero')
    return
  }

  try {
    // Aseguramos que el token esté en headers
    api.defaults.headers.common['Authorization'] = `Bearer ${userStore.token}`
    const response = await api.get('/users')
    usuarios.value = response.data
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.message || 'No se pudieron cargar los usuarios')
  }
}

// Opcional: cargar usuarios al montar si quieres
// onMounted(obtenerUsuarios)
</script>

<style scoped>
/* Contenedor de toda la pantalla centrado */
body,
html {
  height: 100%;
  margin: 0;
  font-family: Arial, sans-serif;
  display: flex;
  justify-content: center; /* centrado horizontal */
  align-items: center; /* centrado vertical */
  background: #f0f2f5; /* fondo de pantalla */
}

/* Contenedor principal centrado y con sombra */
.alta-usuario {
  width: 100%;
  max-width: 600px; /* ancho máximo */
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  text-align: center; /* centra los títulos y botones */
}

/* Títulos */
h2,
h3 {
  margin-bottom: 20px;
  color: #333;
}

/* Formulario en columna con espacio entre campos */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Grupo de campos */
.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

/* Labels */
label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #555;
}

/* Inputs grandes */
input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  font-size: 1rem;
}

input:focus {
  border-color: #007bff;
}

.is-invalid {
  border-color: red;
}

.error {
  color: red;
  font-size: 0.9em;
}

/* Botones */
.btn {
  background: #007bff;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.3s;
  width: 100%; /* ocupa todo el ancho del contenedor */
}

.btn:hover {
  background: #0056b3;
}

.btn.secondary {
  background: #28a745;
  margin-top: 10px;
}

.btn.secondary:hover {
  background: #1e7e34;
}

/* Lista de usuarios */
.usuarios-lista {
  margin-top: 30px;
}

.usuarios-lista table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  table-layout: fixed;
}

.usuarios-lista th,
.usuarios-lista td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.usuarios-lista th {
  background: #007bff;
  color: #fff;
}

.usuarios-lista td {
  color: #333;
}

.usuarios-lista tr:hover {
  background: #f1f1f1;
}

/* Responsividad */
@media (max-width: 640px) {
  .alta-usuario {
    padding: 20px;
  }

  input,
  .btn {
    font-size: 0.9rem;
    padding: 10px;
  }
}
</style>
