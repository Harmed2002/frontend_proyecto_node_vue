import { http } from "./Http"

export default {
	registroUsuario(datos) {
		return http().post('/auth/registro', datos);
	},

	login(datos) {
		return http().post('/auth/login', datos);
	},

	perfil(){
		return http().get('/auth/perfil');
	}
}