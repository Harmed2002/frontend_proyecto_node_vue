<template>
	<h1>Perfil</h1>
	{{ perfil }}
</template>

<script>
	import { onMounted, ref } from 'vue'
	import authService from "../../service/AuthService"

	export default {
		setup() {
			const perfil = ref(null)

			onMounted(async () => {
				const { data } = await authService.perfil()
				perfil.value = data
			})

			return {
				perfil
			}
		}
	}
</script>

<style></style>