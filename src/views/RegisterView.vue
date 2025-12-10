<template>
    <div class="container d-flex justify-content-center align-items-center py-5">
        <div class="card shadow p-4" style="width: 500px;">
            <div class="card-body">
                <h3 class="text-center mb-4 text-primary">Crear Cuenta</h3>

                <!-- Alertas -->
                <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
                <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

                <form @submit.prevent="handleRegister" v-if="!successMessage">

                    <!-- Documento -->
                    <div class="mb-3">
                        <label class="form-label">Documento</label>
                        <input type="text" class="form-control" v-model="form.documento" required
                            placeholder="Debe coincidir con el Excel cargado">
                        <div class="form-text">Si tu documento no está en la base de datos de RRHH, no podrás
                            registrarte.</div>
                    </div>

                    <!-- Email -->
                    <div class="mb-3">
                        <label class="form-label">Correo Personal</label>
                        <input type="email" class="form-control" v-model="form.email" required>
                    </div>

                    <!-- Departamento (Requisito: Consumir endpoint público) -->
                    <div class="mb-3">
                        <label class="form-label">Departamento (Informativo)</label>
                        <select class="form-select" v-model="form.departamentoId">
                            <option value="" disabled selected>Seleccione...</option>
                            <option v-for="d in departamentos" :key="d.id" :value="d.id">
                                {{ d.nombre }}
                            </option>
                        </select>
                    </div>

                    <!-- Contraseña -->
                    <div class="mb-3">
                        <label class="form-label">Contraseña</label>
                        <input type="password" class="form-control" v-model="form.password" required minlength="6">
                    </div>

                    <div class="d-grid gap-2">
                        <button type="submit" class="btn btn-success" :disabled="isLoading">
                            {{ isLoading ? 'Registrando...' : 'Registrarse' }}
                        </button>
                    </div>
                </form>

                <div class="mt-3 text-center">
                    <small>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link></small>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import api from '../api/axios'; 
import { useRouter } from 'vue-router';

const router = useRouter();

const form = reactive({
    documento: '',
    email: '',
    password: '',
    departamentoId: ''
});

const departamentos = ref([]);
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// 1. Cargar Departamentos al iniciar (Requisito de Endpoint Público)
onMounted(async () => {
    try {
        const response = await api.get('/departamentos');
        departamentos.value = response.data;
    } catch (error) {
        console.error("Error cargando departamentos:", error);
    }
});

// 2. Enviar Registro
const handleRegister = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    try {
        // Enviamos solo lo que pide el DTO del Backend (RegisterDto)
        await api.post('/Auth/register', {
            documento: form.documento,
            email: form.email,
            password: form.password
        });

        successMessage.value = "¡Registro exitoso! Te hemos enviado un correo. Redirigiendo al login...";

        // Esperar 2 segundos y mandar al login
        setTimeout(() => {
            router.push('/login');
        }, 2000);

    } catch (error) {
        // Manejar errores (ej: Documento no existe, password muy débil)
        if (error.response && error.response.data) {
            // A veces Identity devuelve un array de errores
            if (Array.isArray(error.response.data)) {
                errorMessage.value = error.response.data.map(e => e.description).join(', ');
            } else {
                errorMessage.value = error.response.data.toString();
            }
        } else {
            errorMessage.value = "Ocurrió un error inesperado.";
        }
    } finally {
        isLoading.value = false;
    }
};
</script>
