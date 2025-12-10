import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';
import { jwtDecode } from "jwt-decode";
import router from '../router';

export const useAuthStore = defineStore('auth', () => {
    
    // Estado
    const token = ref(localStorage.getItem('token') || null);
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const role = ref(localStorage.getItem('role') || null);

    // Getters
    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => role.value === 'Admin');

    // Acciones
    async function login(documento, password) {
        try {
            const response = await api.post('/Auth/login', { documento, password });
            
            const newToken = response.data.token;
            const userData = response.data.user;

            // 1. Guardar en estado
            token.value = newToken;
            user.value = userData;

            // 2. Decodificar token para sacar el ROL
            const decoded = jwtDecode(newToken);
            // El claim de rol suele venir como "role" o una URL larga de Microsoft
            const roleClaim = decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            
            // A veces es un array si tiene múltiples roles, tomamos el primero o verificamos si incluye Admin
            if (Array.isArray(roleClaim)) {
                role.value = roleClaim.includes('Admin') ? 'Admin' : 'Empleado';
            } else {
                role.value = roleClaim;
            }

            // 3. Guardar en LocalStorage para persistencia
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('role', role.value);

            // 4. Redirigir según rol
            if (isAdmin.value) {
                router.push('/admin/dashboard');
            } else {
                router.push('/empleado/home');
            }

            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return { 
                success: false, 
                message: error.response?.data || "Error al iniciar sesión" 
            };
        }
    }

    function logout() {
        token.value = null;
        user.value = null;
        role.value = null;
        localStorage.clear();
        router.push('/login');
    }

    return { token, user, role, isAuthenticated, isAdmin, login, logout };
});