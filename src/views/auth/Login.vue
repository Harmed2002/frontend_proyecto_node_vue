<template>
	<!--
	<h1>Ingreso</h1>
	{{ usuario }}
	<br>
	<input type="email" placeholder="Digite su email" v-model="usuario.email">
	<input type="password" placeholder="Digite su clave" v-model="usuario.password">
	<br>
	<button @click="ingresar">Ingresar</button>
	<br>
	{{ jwt }}
	-->
	<p v-if="errores">{{ errores }}</p>

	<div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Bienvenido!</div>
                        <span class="text-600 font-medium">Iniciar Sesión</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Correo</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="usuario.email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="usuario.password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Recuérdame</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">¿Olvidó su contraseña?</a>
                        </div>
                        <Button label="Ingresar" class="w-full p-3 text-xl" @click="ingresar"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
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