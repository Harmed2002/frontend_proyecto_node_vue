<template>
	<div class="card">
		<h1>Perfil</h1>
		{{ perfil }}
		<h5>Carrito</h5>
		{{ storeCarrito.carrito }}  <!-- Pinia -->
	</div>
</template>

<script>
	import { onMounted, ref } from 'vue'
	import authService from "../../service/AuthService"
	import { useCarritoStore } from '@/stores/carrito' // Pinia

	export default {
		setup() {
			const perfil = ref(null)

			const storeCarrito = useCarritoStore(); // Pinia

			onMounted(async () => {
				const { data } = await authService.perfil()
				perfil.value = data
			})

			return {
				perfil,
				storeCarrito // Pinia
			}
		}
	}
</script>

<style></style>