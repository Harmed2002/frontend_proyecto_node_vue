import { http } from "./Http"

export default {
    listarCategoria() {
        return http().get(`/categoria`);
    },

    guardarCategoria(datos) {
        return http().post(`/categoria`, datos);
    },

    mostrarCategoria(id) {
        return http().get(`/categoria/${id}`);
    },

    modificarCategoria(id, datos) {
        return http().put(`/categoria/${id}`, datos);
    },

    eliminarCategoria(id) {
        return http().delete(`/categoria/${id}`);
    }


}