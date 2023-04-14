<template>
	<h1>Ingreso</h1>
	{{ usuario }}
	<br>
	<input type="email" placeholder="Digite su email" v-model="usuario.email">
	<input type="password" placeholder="Digite su clave" v-model="usuario.password">
	<br>
	<button @click="ingresar">Ingresar</button>
	<br>
	{{ jwt }}
	<p v-if="errores">{{ errores }}</p>
</template>

<script>
	import { ref } from "vue"
	import authService from "../../service/AuthService"
	import { useRouter } from "vue-router"

	export default {
		setup() {
			const router = useRouter()
			const usuario = ref({email: "", password: ""})
			const jwt = ref({})
			const errores = ref(null)

			const ingresar = async () => {
				try{
					const { data } = await authService.login(usuario.value);
					jwt.value = data
					localStorage.setItem("access_token", data.access_token)
					router.push({name: 'Perfil'})
				}catch(error){
					errores.value = error
				}
			}

			return {
				usuario,
				ingresar,
				jwt,
				errores
			}
		}
	}
</script>

<style>
</style>