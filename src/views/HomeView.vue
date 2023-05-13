<template>
	<main>
		<!--TheWelcome /-->

		<Carrito></Carrito>

		<h1>{{ store.contador }}</h1>
		<button @click="store.incrementar">+</button>
		<button @click="store.decrementar">-</button>
	</main>
</template>

<script>
	import TheWelcome from '../components/TheWelcome.vue'
	import Carrito from '../components/Carrito.vue'
	import { useContadorStore } from '@/stores/contador'

	export default {
		components: {
			Carrito
		},

		setup () {
			const store = useContadorStore();

			return {
				store
			}
		}
	}
</script>
