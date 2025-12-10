import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import HomeView from '../views/employee/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
        path: '/admin/dashboard',
        name: 'admin-dashboard',
        component: DashboardView, 
        meta: { requiresAuth: true, role: 'Admin' }
    },
    {
        path: '/empleado/home',
        name: 'empleado-home',
        component: HomeView,
        meta: { requiresAuth: true, role: 'Empleado' }
    }
  ]
})

//Guardian
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next('/login');
    }

    if (to.meta.role && authStore.role !== to.meta.role) {
        if (authStore.isAdmin) return next('/admin/dashboard');
        return next('/empleado/home');
    }

    next();
});

export default router