<template>
    <div class="min-vh-100 bg-light">
        <!-- Navbar Superior -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold" href="#">TalentoPlus <span
                        class="badge bg-white text-primary">Admin</span></a>
                <div class="d-flex align-items-center text-white">
                    <span class="me-3">Hola, {{ authStore.user?.userName }}</span>
                    <button @click="authStore.logout()" class="btn btn-outline-light btn-sm">Cerrar Sesión</button>
                </div>
            </div>
        </nav>

        <div class="container py-4">

            <!-- SECCIÓN 1: TARJETAS DE INFORMACIÓN (KPIs) -->
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card text-white bg-success shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title">Total Empleados</h5>
                            <h2 class="display-4 fw-bold">{{ kpis.totalEmpleados }}</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-white bg-warning shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title">En Vacaciones</h5>
                            <h2 class="display-4 fw-bold">{{ kpis.enVacaciones }}</h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-white bg-info shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title">Departamentos</h5>
                            <ul class="list-unstyled m-0">
                                <li v-for="(cant, nombre) in kpis.empleadosPorDepartamento" :key="nombre"
                                    class="d-flex justify-content-between">
                                    <span>{{ nombre }}</span>
                                    <span class="badge bg-light text-dark">{{ cant }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN 2: INTELIGENCIA ARTIFICIAL -->
            <div class="card shadow-sm mb-4 border-0">
                <div class="card-header bg-white border-bottom-0 pt-3">
                    <h5 class="text-primary"><i class="bi bi-robot"></i> Asistente IA (Gemini)</h5>
                </div>
                <div class="card-body bg-light rounded-bottom">
                    <div class="input-group mb-3">
                        <input v-model="preguntaIA" type="text" class="form-control"
                            placeholder="Ej: ¿Cuántos empleados ganan más de 3 millones? o ¿Quiénes están en Tecnología?"
                            @keyup.enter="consultarIA">
                        <button class="btn btn-primary" type="button" @click="consultarIA" :disabled="loadingIA">
                            {{ loadingIA ? 'Pensando...' : 'Preguntar' }}
                        </button>
                    </div>
                    <!-- Respuesta de la IA -->
                    <div v-if="respuestaIA" class="alert alert-light border shadow-sm">
                        <strong>Respuesta:</strong> {{ respuestaIA }}
                    </div>
                </div>
            </div>

            <!-- SECCIÓN 3: GESTIÓN DE EMPLEADOS (CRUD + EXCEL + PDF) -->
            <div class="card shadow-sm">
                <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h5 class="m-0 text-dark">Nómina de Empleados</h5>
                    <div>
                        <!-- Input oculto para subir excel -->
                        <input type="file" ref="fileInput" @change="subirExcel" class="d-none" accept=".xlsx">

                        <button class="btn btn-success me-2" @click="$refs.fileInput.click()" :disabled="uploading">
                            <span v-if="uploading">Subiendo...</span>
                            <span v-else>📤 Importar Excel</span>
                        </button>
                        <button class="btn btn-primary" @click="abrirModalCrear">
                            ➕ Nuevo Empleado
                        </button>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Documento</th>
                                    <th>Nombre Completo</th>
                                    <th>Cargo</th>
                                    <th>Departamento</th>
                                    <th>Estado</th>
                                    <th class="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="emp in empleados" :key="emp.id">
                                    <td>{{ emp.documento }}</td>
                                    <td>
                                        <div class="fw-bold">{{ emp.nombres }} {{ emp.apellidos }}</div>
                                        <small class="text-muted">{{ emp.email }}</small>
                                    </td>
                                    <td>{{ emp.cargo }}</td>
                                    <td><span class="badge bg-secondary">{{ emp.departamento?.nombre || 'Sin Asignar'
                                            }}</span></td>
                                    <td>
                                        <span class="badge"
                                            :class="emp.estado === 'Activo' ? 'bg-success' : 'bg-warning'">
                                            {{ emp.estado }}
                                        </span>
                                    </td>
                                    <td class="text-end">
                                        <button class="btn btn-sm btn-outline-danger me-1" @click="descargarPDF(emp)"
                                            title="Hoja de Vida">
                                            📄 PDF
                                        </button>
                                        <button class="btn btn-sm btn-outline-primary me-1"
                                            @click="abrirModalEditar(emp)">
                                            ✏️
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger" @click="eliminarEmpleado(emp.id)">
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                                <tr v-if="empleados.length === 0">
                                    <td colspan="6" class="text-center py-4 text-muted">No hay empleados registrados.
                                        Importa un Excel.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>

        <!-- MODAL (Formulario Crear/Editar) -->
        <div v-if="showModal" class="modal-backdrop fade show"></div>
        <div v-if="showModal" class="modal fade show d-block" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ isEditing ? 'Editar Empleado' : 'Nuevo Empleado' }}</h5>
                        <button type="button" class="btn-close" @click="cerrarModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="guardarEmpleado">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label">Documento</label>
                                    <input type="text" class="form-control" v-model="form.documento"
                                        :disabled="isEditing" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" v-model="form.email" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Nombres</label>
                                    <input type="text" class="form-control" v-model="form.nombres" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Apellidos</label>
                                    <input type="text" class="form-control" v-model="form.apellidos" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Cargo</label>
                                    <input type="text" class="form-control" v-model="form.cargo" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Salario</label>
                                    <input type="number" class="form-control" v-model="form.salario" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Departamento</label>
                                    <select class="form-select" v-model="form.departamentoId" required>
                                        <option v-for="d in departamentosLista" :key="d.id" :value="d.id">{{ d.nombre }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Estado</label>
                                    <select class="form-select" v-model="form.estado">
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                        <option value="Vacaciones">Vacaciones</option>
                                    </select>
                                </div>
                                <!-- Campos extra para cumplir el modelo completo -->
                                <div class="col-md-6">
                                    <label class="form-label">Dirección</label>
                                    <input type="text" class="form-control" v-model="form.direccion">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Teléfono</label>
                                    <input type="text" class="form-control" v-model="form.telefono">
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Perfil Profesional</label>
                                    <textarea class="form-control" v-model="form.perfilProfesional" rows="2"></textarea>
                                </div>
                            </div>
                            <div class="mt-4 text-end">
                                <button type="button" class="btn btn-secondary me-2"
                                    @click="cerrarModal">Cancelar</button>
                                <button type="submit" class="btn btn-primary">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useAuthStore } from '../../stores/auth';
import api from '../../api/axios';

const authStore = useAuthStore();

// --- ESTADO ---
const kpis = ref({ totalEmpleados: 0, enVacaciones: 0, empleadosPorDepartamento: {} });
const empleados = ref([]);
const departamentosLista = ref([]);

// IA
const preguntaIA = ref('');
const respuestaIA = ref('');
const loadingIA = ref(false);

// Excel
const fileInput = ref(null);
const uploading = ref(false);

// Modal
const showModal = ref(false);
const isEditing = ref(false);
const currentId = ref(0); // Para saber a quién editamos
const form = reactive({
    documento: '', nombres: '', apellidos: '', email: '',
    cargo: '', salario: 0, departamentoId: '', estado: 'Activo',
    direccion: '', telefono: '', perfilProfesional: '', nivelEducativo: 'Profesional',
    fechaNacimiento: new Date().toISOString(), fechaIngreso: new Date().toISOString()
});

// --- API CALLS ---

onMounted(() => {
    cargarDatos();
});

const cargarDatos = async () => {
    try {
        // Cargar todo en paralelo
        const [kpiRes, empRes, deptoRes] = await Promise.all([
            api.get('/Dashboard/Kpis'),
            api.get('/Empleados'),
            api.get('/Departamentos')
        ]);

        kpis.value = kpiRes.data;
        empleados.value = empRes.data;
        departamentosLista.value = deptoRes.data;
    } catch (error) {
        console.error("Error cargando dashboard:", error);
    }
};

// 1. INTELIGENCIA ARTIFICIAL
const consultarIA = async () => {
    if (!preguntaIA.value) return;
    loadingIA.value = true;
    try {
        const res = await api.post('/Dashboard/ia-query', { pregunta: preguntaIA.value });
        respuestaIA.value = res.data.respuesta;
    } catch (error) {
        respuestaIA.value = "Error consultando a Gemini.";
    } finally {
        loadingIA.value = false;
    }
};

// 2. EXCEL
const subirExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    uploading.value = true;

    try {
        await api.post('/Empleados/Import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Carga exitosa');
        cargarDatos(); // Recargar tabla
    } catch (error) {
        alert('Error cargando Excel');
    } finally {
        uploading.value = false;
        event.target.value = null; // Limpiar input
    }
};

// 3. PDF
const descargarPDF = async (emp) => {
    try {
        // Importante: responseType blob para archivos binarios
        const response = await api.get(`/Empleados/${emp.id}/CV`, { responseType: 'blob' });

        // Crear enlace invisible para descargar
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `HV_${emp.documento}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        alert("Error generando PDF");
    }
};

// 4. CRUD MANUAL
const abrirModalCrear = () => {
    isEditing.value = false;
    resetForm();
    showModal.value = true;
};

const abrirModalEditar = (emp) => {
    isEditing.value = true;
    currentId.value = emp.id;
    // Copiar datos al form
    Object.assign(form, emp);
    // Ajustar el ID de departamento si viene anidado
    if (emp.departamentoId) form.departamentoId = emp.departamentoId;
    showModal.value = true;
};

const cerrarModal = () => showModal.value = false;

const resetForm = () => {
    Object.keys(form).forEach(k => form[k] = '');
    form.salario = 0;
    form.estado = 'Activo';
    form.fechaNacimiento = new Date().toISOString();
    form.fechaIngreso = new Date().toISOString();
    form.nivelEducativo = 'Profesional'; // Valor por defecto
};

const guardarEmpleado = async () => {
    try {
        // Convertir salario a número
        form.salario = Number(form.salario);

        if (isEditing.value) {
            await api.put(`/Empleados/${currentId.value}`, form);
        } else {
            await api.post('/Empleados', form);
        }
        cerrarModal();
        cargarDatos(); // Refrescar tabla y KPIs
    } catch (error) {
        alert("Error guardando empleado: " + (error.response?.data || error.message));
    }
};

const eliminarEmpleado = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este empleado?")) return;
    try {
        await api.delete(`/Empleados/${id}`);
        cargarDatos();
    } catch (error) {
        alert("Error eliminando");
    }
};
</script>

<style scoped>
.modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5);
}
</style>