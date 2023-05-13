import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCarritoStore = defineStore('carrito', () => {
  const carrito = ref([]);
  const cliente_seleccionado = ref(null);

  const agregarCarrito = (p) => {
    carrito.value.push(p);
  };


  return { carrito, agregarCarrito, cliente_seleccionado }
})
