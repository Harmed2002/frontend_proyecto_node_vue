<template>
    <div>
        <h1>Registro</h1>
        {{ usuario }}
        <input type="text" placeholder="Nombre" v-model="usuario.nombre">
        <input type="text" placeholder="Apellidos" v-model="usuario.apellidos">
        <input type="email" placeholder="Email" v-model="usuario.email">
        <input type="password" placeholder="Contraseña" v-model="usuario.password">
        <input type="button" value="Registrarse" @click="registrarse">
    </div>

    <Carrito></Carrito>
</template>

<script>
    import { ref } from "vue"
    import authService from "../../service/AuthService"
    import Carrito from '../../components/Carrito.vue'

    export default {
        components: { Carrito },
        setup(){
            const usuario = ref({})

            const registrarse = async () => {
                const { data } = await authService.registroUsuario(usuario.value);
            }

            return {
                usuario,
                registrarse
            }
        }
    }
</script>

<style>

</style>