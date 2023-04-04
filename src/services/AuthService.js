import { http } from "./Http"

export default {
    registroUsuario(datos){
        //return http().post('/registro/auth/registro', datos);
        return http().post('/auth/registro', datos);
    },

    login(datos){
        return http().post('/auth/login', datos);
    }
}