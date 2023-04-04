// En este arcjivo se configuran las peticiones al servidor

import axios from 'axios'

const urlServidor = 'http://127.0.0.1:3000/api';

// Configuro la conexion a la api con axios
export const http = () => {
    const interceptor = axios.create({
        baseURL: urlServidor,
        headers: {
            'Accept': 'application/json'
        },
        timeout: 30000
    })

    // Errores
    interceptor.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            if (error.response.status === 401){
                window.location.href = "/login"
            }

            return Promise.reject(error)
        }
    )

    return interceptor;
}
