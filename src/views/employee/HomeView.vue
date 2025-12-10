<template>
    <div class="min-vh-100 bg-light">
        <!-- Navbar Simple -->
        <nav class="navbar navbar-light bg-white shadow-sm mb-4">
            <div class="container">
                <span class="navbar-brand mb-0 h1 fw-bold text-primary">Portal del Empleado</span>
                <div class="d-flex align-items-center">
                    <span class="me-3 text-secondary">Hola, {{ empleado?.nombres }}</span>
                    <button @click="authStore.logout()" class="btn btn-outline-danger btn-sm">Salir</button>
                </div>
            </div>
        </nav>

        <div class="container">
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">Cargando tu perfil...</p>
            </div>

            <div v-else-if="empleado" class="row justify-content-center">
                <!-- Tarjeta Principal: Perfil -->
                <div class="col-lg-8">
                    <div class="card shadow-sm border-0 mb-4">
                        <div class="card-body p-5">

                            <!-- Cabecera del Perfil -->
                            <div class="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
                                <div>
                                    <h2 class="fw-bold mb-1">{{ empleado.nombres }} {{ empleado.apellidos }}</h2>
                                    <h5 class="text-muted mb-3">{{ empleado.cargo }}</h5>
                                    <span class="badge bg-success rounded-pill px-3">{{ empleado.estado }}</span>
                                </div>
                                <!-- Botón de Acción Principal -->
                                <button @click="descargarMiPDF" class="btn btn-primary btn-lg shadow-sm"
                                    :disabled="downloading">
                                    <span v-if="downloading">Generando...</span>
                                    <span v-else>📄 Descargar mi Hoja de Vida</span>
                                </button>
                            </div>

                            <!-- Detalles en 2 Columnas -->
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <h6 class="text-uppercase text-secondary fw-bold small mb-3">Información Laboral
                                    </h6>
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><strong>Departamento:</strong> {{ empleado.departamento?.nombre
                                            || 'Sin asignar' }}</li>
                                        <li class="mb-2"><strong>Fecha Ingreso:</strong> {{
                                            formatearFecha(empleado.fechaIngreso) }}</li>
                                        <li class="mb-2"><strong>Salario:</strong> $ {{
                                            empleado.salario.toLocaleString() }}</li>
                                        <li class="mb-2"><strong>Nivel Educativo:</strong> {{ empleado.nivelEducativo }}
                                        </li>
                                    </ul>
                                </div>

                                <div class="col-md-6">
                                    <h6 class="text-uppercase text-secondary fw-bold small mb-3">Contacto</h6>
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><strong>Email:</strong> {{ empleado.email }}</li>
                                        <li class="mb-2"><strong>Teléfono:</strong> {{ empleado.telefono }}</li>
                                        <li class="mb-2"><strong>Dirección:</strong> {{ empleado.direccion }}</li>
                                        <li class="mb-2"><strong>Documento:</strong> {{ empleado.documento }}</li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Perfil Profesional -->
                            <div class="mt-4 bg-light p-4 rounded-3">
                                <h6 class="text-uppercase text-secondary fw-bold small mb-2">Perfil Profesional</h6>
                                <p class="mb-0 text-muted" style="white-space: pre-line;">
                                    {{ empleado.perfilProfesional || 'No hay descripción disponible.' }}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <!-- Error si no hay datos -->
            <div v-else class="alert alert-warning text-center">
                No pudimos cargar tu información. Es posible que tu usuario no esté vinculado a un empleado. Contacta a
                RRHH.
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import api from '../../api/axios';

const authStore = useAuthStore();
const empleado = ref(null);
const loading = ref(true);
const downloading = ref(false);

onMounted(async () => {
    try {
        const response = await api.get('/Empleados/Me');
        empleado.value = response.data;
    } catch (error) {
        console.error("Error cargando perfil:", error);
    } finally {
        loading.value = false;
    }
});

const descargarMiPDF = async () => {
    downloading.value = true;
    try {
        const response = await api.get('/Empleados/Me/CV', { responseType: 'blob' });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Mi_Hoja_De_Vida.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        alert("Error descargando el PDF.");
    } finally {
        downloading.value = false;
    }
};

const formatearFecha = (fechaString) => {
    if (!fechaString) return '-';
    return new Date(fechaString).toLocaleDateString();
};
</script>