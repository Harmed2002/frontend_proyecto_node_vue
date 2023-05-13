import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useContadorStore = defineStore('contador', () => {
  const contador = ref(0);

  const incrementar = () => {
    contador.value++;
  };

  const decrementar = () => {
    contador.value--;
  };

  return { contador, incrementar, decrementar }
})
