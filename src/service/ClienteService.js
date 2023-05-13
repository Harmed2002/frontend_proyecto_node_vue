import { http } from "./Http"

export default {
    listar: (q='') => {
        return http().get(`/cliente?q=${q}`);
    },

    guardar: (datos) => {
        return http().post(`/cliente`, datos);
    },

    mostrar: (id) => {
        return http().get(`/cliente/${id}`);
    },

    modificar: (id, datos) => {
        return http().put(`/cliente/${id}`, datos);
    },

    eliminar: (id) => {
        return http().delete(`/cliente/${id}`);
    }

}