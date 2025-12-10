<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card shadow p-4" style="width: 400px;">
            <div class="card-body">
                <h3 class="text-center mb-4 text-primary">TalentoPlus</h3>
                <h5 class="text-center mb-4 text-secondary">Iniciar Sesión</h5>

                <div v-if="errorMessage" class="alert alert-danger" role="alert">
                    {{ errorMessage }}
                </div>

                <form @submit.prevent="handleSubmit">
                    <div class="mb-3">
                        <label for="documento" class="form-label">Documento de Identidad</label>
                        <input type="text" class="form-control" id="documento" v-model="documento" required
                            placeholder="Ej: 12345678">
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña</label>
                        <input type="password" class="form-control" id="password" v-model="password" required
                            placeholder="******">
                    </div>

                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-primary" :disabled="isLoading">
                            {{ isLoading ? 'Cargando...' : 'Ingresar' }}
                        </button>
                    </div>
                </form>

                <div class="mt-3 text-center">
                    <small>¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link></small>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const documento = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    const result = await authStore.login(documento.value, password.value);

    if (!result.success) {
        errorMessage.value = typeof result.message === 'string'
            ? result.message
            : 'Credenciales incorrectas o error de conexión';
    }

    isLoading.value = false;
};
</script>