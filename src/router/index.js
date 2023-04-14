import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Registro from '../views/auth/Registro.vue'
import Login from '../views/auth/Login.vue'
import Perfil from '../views/admin/Perfil.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/about',
			name: 'about',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/AboutView.vue')
		},

		{
			path: '/registro',
			name: 'Registro',
			component: Registro
		},

		{
			path: '/login',
			name: 'Login',
			component: Login
		},

		{
			path: '/admin/perfil',
			name: 'Perfil',
			component: Perfil
		}
	]
})

export default router
