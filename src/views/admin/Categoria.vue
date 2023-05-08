<template>
	<h1>Categorías</h1>
	
	<label for="nombre">Nombre:</label><br>
	<input type="text" id="nombre" v-model="categoria.nombre"><br>

	<label for="detalle">Detalle:</label><br>
	<textarea id="detalle" rows = "3" cols = "30" v-model="categoria.detalle"></textarea><br>

	<input type="button" :value="(categoria.id) ? 'Modificar Categoría' : 'Guardar Categoría'" @click="guardarCategoria"><br><br>
	<button @click="clearCategoria()">Cancelar</button>

	<DataTable :value = "categorias" responsiveLayout = "scroll">
		<Column field = "id" header = "Id"></Column>
		<Column field = "nombre" header = "Nombre"></Column>
		<Column field = "detalle" header = "Detalle"></Column>
		<Column :exportable="false" style="min-width:8rem">
			<template #body="slotProps">
				<Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editarCategoria(slotProps.data)" />
				<Button icon="pi pi-trash" outlined rounded severity="danger" @click="eliminarCategoria(slotProps.data)" />
			</template>
		</Column>
	</DataTable>

</template>

<script>
	import { ref, onMounted } from 'vue'
	import categoriaService from "@/service/CategoriaService.js"

	export default {
		setup() {
			const categorias = ref([])
			const categoria = ref({nombre: '', detalle: ''})

			onMounted(() => {
				listarCategorias()
			})

			const listarCategorias = async () => {
				const {data} = await categoriaService.listarCategoria()
				categorias.value = data
			}

			const guardarCategoria = async () => {
				if(categoria.value.id) {
					// Modificar
					const {data} = await categoriaService.modificarCategoria(categoria.value.id, categoria.value)
				}else{
					// Guardar
					const {data} = await categoriaService.guardarCategoria(categoria.value)
				}

				listarCategorias()
				//categoria.value = {nombre: '', detalle: ''}
				clearCategoria()
				
			}

			const editarCategoria = (cat) => {
				categoria.value = cat
			}

			const clearCategoria = () => {
				categoria.value = {nombre: '', detalle: ''}
			}

			const eliminarCategoria = async (cat) => {
				const {data} = await categoriaService.eliminarCategoria(cat.id)

				listarCategorias()
				clearCategoria()
			}

			return {
				categorias,
				categoria,
				guardarCategoria,
				editarCategoria,
				clearCategoria,
				eliminarCategoria
			}
		}
	}
</script>

<style></style>