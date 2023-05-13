<template>
	<div class="grid">
		<div class="col-7">
			<div class="card">
				<h5>Lista de Productos</h5>
				<DataTable :value="productos" responsiveLayout="scroll">
					<Column field="id" header="Id"></Column>
					<Column field="nombre" header="Nombre"></Column>
					<Column field="precio" header="Precio"></Column>
					<Column field="stock" header="Stock"></Column>
					<Column :exportable="false">
						<template #body="slotProps">
							<Button icon="pi pi-angle-double-right" outlined rounded class="mr-2" @click="addCarrito(slotProps.data)" />
						</template>
					</Column>
				</DataTable>
			</div>
		</div>
		<div class="col-5">
			<div class="grid">
				<div class="col-12">
					<div class="card">
						<h5>Carrito</h5>
						<!-- {{ storeCarrito.carrito }} -->
						<DataTable :value="carrito" responsiveLayout="scroll">
							<Column field="nombre" header="Nombre"></Column>
							<Column field="precio" header="Precio"></Column>
							<Column field="cantidad" header="Cant"></Column>
							<Column :exportable="false">
								<template #body="slotProps">
									<Button icon="pi pi-trash" outlined rounded severity="danger" @click="quitarCarrito(slotProps.data)" />
								</template>
							</Column>
						</DataTable>
					</div>
				</div>
				<div class="col-12">
					<div class="card">
						<h5>Cliente</h5>
						<div class="grid">
							<div class="col-8">
								<inputText type="text" v-model="buscar" @keyup="buscarCliente"/>
							</div>
							<div class="col-4">
								<Button label="Nuevo" icon="pi pi-user-plus" @click="displayModal=true"/>
							</div>
							<div class="col-12" v-if="cliente_seleccionado">
								<h5>Nombre: {{ cliente_seleccionado.nombre_completo }}</h5>
								<h5>Teléfono: {{ cliente_seleccionado.telefono }}</h5>
								<h5>Correo: {{ cliente_seleccionado.correo }}</h5>
							</div>
						</div>
					</div>
				</div>
				<div class="col-12">
					<div class="card">
						<h5>Pedido</h5>
						<!--h2>Total: ${{ getTotal() }}</!--h2-->
						<!-- {{ carrito }} -->
						<h2>Total: ${{ new Intl.NumberFormat().format(getTotal()) }}</h2>
						<Button label="Registrar Pedido" icon="pi pi-save" class="block" @click="registrarPedido"/>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Dialog v-model:visible="displayModal" modal header="Nuevo Cliente" :style="{ width: '50vw' }" class="p-fluid">
		<div class="field">
			<label for="nombre">Nombre Completo</label>
			<InputText id="nombre" v-model.trim="cliente.nombre_completo" required="true" autofocus />
		</div>
		<div class="field">
			<label for="telefono">Teléfono</label>
			<InputText id="telefono" v-model.trim="cliente.telefono" />
		</div>
		<div class="field">
			<label for="correo">Correo</label>
			<InputText id="correo" v-model.trim="cliente.correo" />
		</div>
		<template #footer>
			<Button label="Cerrar" icon="pi pi-times" @click="displayModal = false" text />
			<Button label="Guardar" icon="pi pi-save" @click="guardarCliente" />
		</template>
	</Dialog>
</template>

<script>
	import productoService from "@/service/ProductoService.js"
	import clienteService from "@/service/ClienteService.js"
	import pedidoService from "@/service/PedidoService.js"
	import { useRouter, useRoute } from "vue-router"
	import {ref, onMounted} from "vue"
	import { useCarritoStore } from '@/stores/carrito'

	export default {
		setup() {
			const productos = ref([]);
			const carrito = ref([]);
			const displayModal = ref(false);
			const cliente = ref({nombre_completo: '', telefono: '', correo: ''});
			const cliente_seleccionado = ref(null);
			const buscar = ref('');
			const router = useRouter();
			const route = useRoute();

			const storeCarrito = useCarritoStore(); // Pinia

			onMounted(() => {
				listarProductos();
				carrito.value = storeCarrito.carrito;
				cliente_seleccionado.value = storeCarrito.cliente_seleccionado;
			});

			const listarProductos = async () => {
				try {
					const {data} = await productoService.listar();

					productos.value = data.rows;
				} catch (error) {
					console.log(error);
				}
				
			}

			const buscarCliente = async () => {
				if (buscar.value != "") {
					const { data } = await clienteService.listar(buscar.value);
					//console.log(data);
					cliente_seleccionado.value = data.length > 0 ? data[0] : null;
					storeCarrito.cliente_seleccionado = cliente_seleccionado.value;
				} else {
					cliente_seleccionado.value = null;
					storeCarrito.cliente_seleccionado = null;
				}
			}

			const guardarCliente = async () => {
				// Se guarda el nuevo cliente
				const { data } = await clienteService.guardar(cliente.value);

				// el nuevo cliente se selecciona para el pedido
				cliente_seleccionado.value = data.data;
				storeCarrito.cliente_seleccionado = cliente_seleccionado.value;

				// Cerramos la ventana
				displayModal.value = false
			}

			const addCarrito = (prod) => {
				let pos = -1;

				for (let i = 0; i < carrito.value.length; i++) {
					const pr = carrito.value[i];
					if (pr.id == prod.id) {
						pos = i;
					}
				}

				if (pos >= 0) {
					carrito.value[pos].cantidad++; // Si en el carrito ya existe el producto, se le suma 1 a la cantidad
				} else {
					//carrito.value.push({id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1});
					storeCarrito.agregarCarrito({id: prod.id, nombre: prod.nombre, precio: prod.precio, cantidad: 1}); // Llenamos carrito de Pinia
				}

				prod.stock--; // Voy restando del stock

			}

			const quitarCarrito = (prod) => {
				let pos = -1;

				// Busco en el carrito la posición del objeto con el mismo id que viene en prod
				for (let i = 0; i < carrito.value.length; i++) {
					const pr = carrito.value[i];
					if (pr.id == prod.id) {
						pos = i;
					}
				}

				if (pos >= 0) {
					//console.log(prod.rowData.id);
					//console.log(carrito.value[pos].cantidad);
					productos.value.forEach(function(producto) {
						if (producto.id === carrito.value[pos].id) {
							producto.stock = producto.stock + carrito.value[pos].cantidad; // Si elimino un producto, lo sumo de nuevo al stock
						}
					});
					
					carrito.value.splice(pos, 1); // Elimino el producto del carrito
				}

			}

			const getTotal = () => {
				let st = 0;
				carrito.value.forEach(prod => {
					st += parseFloat(prod.precio) * parseFloat(prod.cantidad);	// Calculo el subtotal
				})

				return st.toFixed(2);
			}

			const registrarPedido = async () => {
				let prods = [];

				carrito.value.forEach(prod => {
					prods.push({producto_id: prod.id, cantidad: prod.cantidad})
				})
				// Así se envía la info. en el body.
				let pedido = {
					nro_fact: 0,
					clienteId: cliente_seleccionado.value.id,
					carrito: prods
				}
				
				await pedidoService.guardar(pedido);

				// Limpio las variables del carrito Pinia
				storeCarrito.cliente_seleccionado = null;
				storeCarrito.carrito = [];

				router.push({
					name: 'ListaPedido',	// Esta es la ruta que esta en /router/index.js
					/*query: {
						...route.query,
						...query,
					},*/
				})

			}
			
			
			return {
				productos,
				carrito,
				addCarrito,
				quitarCarrito,
				displayModal,
				cliente,
				cliente_seleccionado,
				getTotal,
				registrarPedido,
				buscar,
				buscarCliente,
				guardarCliente,
				storeCarrito
			}
		}

	}
</script>

<style></style>